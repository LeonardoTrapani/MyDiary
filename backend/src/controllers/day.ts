import { NextFunction, Request, Response } from 'express';
import { addDays, throwResponseError } from '../utilities';
import { prisma } from '../app';

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
    console.log(plannedDatesOnDate);
    const minutesAlreadyAssigned = plannedDatesOnDate.reduce((prev, curr) => {
      return prev + curr.minutes;
    }, 0);
    console.log({ minutesAlreadyAssigned, freeMinutes });
    if (freeMinutes - minutesAlreadyAssigned < 0) {
      throwResponseError(
        'you already assigned more minutes to this day than what you are specifying, please remove some homework and try again',
        400,
        res
      );
      return;
    }

    const day = await prisma.day.create({
      data: {
        date: new Date(date),
        freeMinutes: freeMinutes,
        userId: +userId!,
      },
      select: {
        date: true,
        freeMinutes: true,
        id: true,
      },
    });
    res.json(day);
  } catch (err) {
    console.log(err);
    throwResponseError('an error has occurred creating the day', 400, res);
  }
};
