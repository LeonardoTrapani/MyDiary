import { NextFunction, Request, Response } from 'express';
import { throwResponseError } from '../utilities';
import { prisma } from '../app';
import moment from 'moment';
import { PlannedDate } from '@prisma/client';
import { fetchWeek, findfreeMinutesInDay } from './week';

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
    const createDayRes = await createOrUpdateDay(+userId!, date, +freeMinutes);
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

export const createOrUpdateDay = async (
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

export const createOrUpdateDayCountingPreviousMinutes = async (
  userId: number,
  date: Date | string,
  freeMinutes: number,
  res: Response
) => {
  const existingDay = await prisma.day.findFirst({
    where: {
      userId: userId,
      date: moment(date).startOf('day').toDate(),
    },
    select: {
      date: true,
      freeMinutes: true,
      id: true,
    },
  });

  if (existingDay) {
    if (existingDay.freeMinutes - freeMinutes < 0) {
      throwResponseError('the minutes are less than 0 somehow', 400, res);
      return;
    }
    const editedDay = await prisma.day.updateMany({
      data: {
        freeMinutes: existingDay.freeMinutes - freeMinutes,
      },
      where: {
        date: moment(date).startOf('day').toDate(),
      },
    });
    return editedDay;
  }

  const week = await fetchWeek(userId);
  if (!week) {
    throwResponseError("could't find the week", 400, res);
    return;
  }
  const previousMinutes = findfreeMinutesInDay(
    moment(date).startOf('day'),
    week
  );
  if (previousMinutes - freeMinutes < 0) {
    throwResponseError('the minutes are less than 0 somehow', 400, res);
    return;
  }
  const day = await prisma.day.create({
    data: {
      date: moment(date).startOf('day').toDate(),
      freeMinutes: previousMinutes - freeMinutes,
      userId: +userId!,
    },
  });
  return day;
};
