import { NextFunction, Request, Response } from 'express';
import { throwResponseError } from '../utilities';
import { prisma } from '../app';
import moment from 'moment';
import { PlannedDate } from '@prisma/client';

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
    const createDayRes = await createDayFunc(+userId!, date, +freeMinutes);
    res.json(createDayRes);
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
    throwResponseError('an error has occurred editing the day', 400, res);
  }
};

export const areMoreMinutesAssigned = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { date, freeMinutes } = req.body;
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
    date = dt?.date;
  } else {
    date = date;
  }

  const { userId } = req;

  const plannedDates = await prisma.plannedDate.findMany({
    where: {
      homework: {
        deleted: false,
        userId: +userId!,
      },
      date: {
        gte: moment().startOf('day').toDate(),
      },
    },
  });
  let plannedDatesOnDate: PlannedDate[] = [];
  plannedDates.forEach((plannedDate) => {
    if (moment(plannedDate.date).isSame(date, 'day')) {
      plannedDatesOnDate.push(plannedDate);
    }
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

export const createDayFunc = async (
  userId: number,
  date: Date | string,
  freeMinutes: number
) => {
  const existingDay = await prisma.day.findFirst({
    where: {
      userId: +userId!,
      date: moment(date).startOf('day').toDate(),
      // date: {
      //   gte: moment().startOf('day').toDate(),
      // },
    },
    select: {
      date: true,
      id: true,
    },
  });

  if (existingDay) {
    console.log({ date: moment(existingDay.date).startOf('day').toDate() });
    const editedDay = await prisma.day.updateMany({
      data: {
        freeMinutes,
      },
      where: {
        date: moment(date).startOf('day').toDate(),
      },
    });
    return editedDay;
  }
  const day = await prisma.day.create({
    data: {
      date: moment(date).startOf('day').toDate(),
      freeMinutes: freeMinutes,
      userId: +userId!,
    },
  });
  return day;
};
