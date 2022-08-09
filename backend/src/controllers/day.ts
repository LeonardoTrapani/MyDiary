import { NextFunction, Request, Response } from 'express';
import { addDays, throwResponseError } from '../utilities';
import { prisma } from '../app';
import { stringify } from 'querystring';

export const getAllDays = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  try {
    const days = await prisma.day.findMany({
      where: {
        userId: +userId!,
      },
      select: {
        date: true,
        freeMinutes: true,
        id: true,
      },
    });
    res.json(days);
  } catch (err) {
    throwResponseError('an error has occurred fetching the days', 400, res);
  }
};

export const createDay = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { date, freeMinutes } = req.body;
  const { userId } = req;
  try {
    const initialDate = new Date(new Date(date).setHours(0, 0, 0, 0));
    const endDate = new Date(new Date(addDays(date, 1).setHours(0, 0, 0, 0)));

    const existingDay = await prisma.day.findFirst({
      where: {
        userId: +userId!,
        date: {
          gte: initialDate,
          lt: endDate,
        },
      },
      select: {
        id: true,
      },
    });
    if (existingDay) {
      const editedDay = await prisma.day.update({
        data: {
          freeMinutes: req.newFreeMinutes,
        },
        where: {
          id: req.existingDayId,
        },
      });
      res.json(editedDay);
      return;
    }
    const day = await prisma.day.create({
      data: {
        date: new Date(date),
        freeMinutes: freeMinutes,
        userId: +userId!,
      },
    });
    res.json(day);
  } catch (err) {
    console.log(err);
    throwResponseError('an error has occurred creating the day', 400, res);
  }
};

export const editDay = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, freeMinutes } = req.body;

    const editedDay = await prisma.day.update({
      data: {
        freeMinutes,
      },
      where: {
        id: id,
      },
    });
    res.json(editedDay);
  } catch (err) {
    console.log(err);
    throwResponseError('an error has occurred editing the day', 400, res);
  }
};

export const areMoreMinutesAssigned = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { date, freeMinutes } = req.body;
  let finalDate;
  if (!date) {
    const { id } = req.body;
    if (!id) {
      throwResponseError('id or date not specified', 400, res);
    }
    const dt = await prisma.day.findUnique({
      where: {
        id,
      },
      select: {
        date: true,
      },
    });
    finalDate = dt?.date;
  } else {
    finalDate = date;
  }

  const initialDate = new Date(new Date(finalDate).setHours(0, 0, 0, 0));
  const endDate = new Date(
    new Date(addDays(finalDate, 1).setHours(0, 0, 0, 0))
  );
  const { userId } = req;

  const plannedDatesOnDate = await prisma.plannedDate.findMany({
    where: {
      homework: {
        deleted: false,
        userId: +userId!,
      },
      date: {
        gte: initialDate,
        lt: endDate,
      },
    },
  });
  const minutesAlreadyAssigned = plannedDatesOnDate.reduce((prev, curr) => {
    return prev + curr.minutes;
  }, 0);

  if (freeMinutes - minutesAlreadyAssigned < 0) {
    throwResponseError(
      'you already assigned more minutes to this day than what you are specifying, please remove some homework and try again',
      400,
      res
    );
    return;
  }
  next();
};
