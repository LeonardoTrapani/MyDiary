import { Request, Response, NextFunction } from 'express';
import {
  areThereExpressValidatorErrors,
  throwResponseError,
} from '../utilities';

import { prisma } from '../app';

export const createHomework = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (areThereExpressValidatorErrors(req, res)) {
    return;
  }
  const { userId } = req;
  let { name, subject, duration, description, expirationDate, plannedDate } =
    req.body;
  try {
    const homework = await prisma.homework.create({
      data: {
        duration,
        expirationDate,
        name,
        description,
        subject,
        plannedDate,
        userId: +userId!,
      },
      select: {
        name: true,
        completed: true,
        duration: true,
        plannedDate: true,
        description: true,
        expirationDate: true,
        subject: true,
      },
    });
    res.json(homework);
  } catch (err) {
    throwResponseError('unable to create homework', 500, res);
  }
};

export const getAllHomework = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = +req.userId!;
  const homework = await prisma.homework.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      subject: true,
      expirationDate: true,
      plannedDate: true,
      duration: true,
      completed: true,
    },
  });
  res.json(homework);
};

export const calculateFreeDays = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (areThereExpressValidatorErrors(req, res)) {
    return;
  }
  const { expirationDate, duration } = req.body;
  const { weekNumber } = req.params;
  const expirationDateDate = new Date(expirationDate);

  const starterDate = addDaysFromToday(+weekNumber * 7 - 7);
  const finishDate = addDaysFromToday(+weekNumber * 7 - 1);

  const { userId } = req;
  try {
    const week = await prisma.week.findUnique({
      where: {
        userId: +userId!,
      },
      select: {
        id: true,
        mondayFreeMinutes: true,
        tuesdayFreeMinutes: true,
        wednesdayFreeMinutes: true,
        thursdayFreeMinutes: true,
        fridayFreeMinutes: true,
        saturdayFreeMinutes: true,
        sundayFreeMinutes: true,
      },
    });
    if (!week) {
      return throwResponseError(
        'please define your usual week before creating any homework',
        400,
        res
      );
    }
    const freeDays = await prisma.user.findUnique({
      where: {
        id: +userId!,
      },
      select: {
        days: {
          select: {
            date: true,
            freeMinutes: true,
          },
          where: {
            date: {
              lt: expirationDateDate,
            },
            AND: {
              freeMinutes: {
                gte: +duration,
              },
              date: {
                lte: finishDate,
                gte: starterDate,
              },
            },
          },
        },
      },
    });
    console.log(freeDays);
    if (!freeDays) {
      return throwResponseError('error finding free days', 400, res);
    }
    const finalFreeDays: {
      date: Date;
      freeHours: number;
    }[] = [];
    for (let i = 0; i < 7; i++) {
      finalFreeDays.push({
        date: addDays(starterDate, i),
        freeHours: findFreeHoursInDay(addDays(starterDate, i), week),
      });
    }
    freeDays.days.forEach((day) => {
      'replace in the final free day array';
    });
    return res.json(finalFreeDays);
  } catch (err) {
    console.log(err);
    return throwResponseError(
      'an error has occurred finding the free hours',
      400,
      res
    );
  }
};

const findFreeHoursInDay = (
  date: Date,
  week: {
    id: number;
    mondayFreeMinutes: number;
    tuesdayFreeMinutes: number;
    wednesdayFreeMinutes: number;
    thursdayFreeMinutes: number;
    fridayFreeMinutes: number;
    saturdayFreeMinutes: number;
    sundayFreeMinutes: number;
  }
) => {
  console.log(week);
  const dayOfTheWeek = date.getDay();
  console.log(dayOfTheWeek);
  switch (dayOfTheWeek) {
    case 0: {
      return week.mondayFreeMinutes;
    }
    case 1: {
      return week.tuesdayFreeMinutes;
    }
    case 2: {
      return week.wednesdayFreeMinutes;
    }
    case 3: {
      return week.thursdayFreeMinutes;
    }
    case 4: {
      return week.fridayFreeMinutes;
    }
    case 5: {
      return week.saturdayFreeMinutes;
    }
    case 6: {
      return week.sundayFreeMinutes;
    }
  }
  return 0;
};

const addDaysFromToday = (daysToAdd: number) => {
  return addDays(new Date(Date.now()), daysToAdd);
};

const addDays = (from: Date, daysToAdd: number) => {
  let result = new Date(from);
  result.setDate(result.getDate() + daysToAdd);
  return result;
};
