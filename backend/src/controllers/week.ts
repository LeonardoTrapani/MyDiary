import { NextFunction, Request, Response } from 'express';
import { prisma } from '../app';
import { throwResponseError } from '../utilities';
export const createWeek = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    mondayFreeMinutes,
    tuesdayFreeMinutes,
    wednesdayFreeMinutes,
    thursdayFreeMinutes,
    fridayFreeMinutes,
    saturdayFreeMinutes,
    sundayFreeMinutes,
  } = req.body;
  const userId = +req.userId!;

  try {
    const weekExistance = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        week: true,
      },
    });
    if (weekExistance?.week) {
      return throwResponseError(
        'An error has occurred: the week has already been created',
        400,
        res
      );
    }
    const week = await prisma.week.create({
      data: {
        mondayFreeMinutes,
        tuesdayFreeMinutes,
        wednesdayFreeMinutes,
        thursdayFreeMinutes,
        fridayFreeMinutes,
        saturdayFreeMinutes,
        sundayFreeMinutes,
        userId,
      },
      select: {
        mondayFreeMinutes: true,
        tuesdayFreeMinutes: true,
        wednesdayFreeMinutes: true,
        thursdayFreeMinutes: true,
        fridayFreeMinutes: true,
        saturdayFreeMinutes: true,
        sundayFreeMinutes: true,
      },
    });
    return res.json(week);
  } catch (err) {
    console.log(err);
    return throwResponseError(
      'an error has occurred creating the week',
      400,
      res
    );
  }
};

export const getWeek = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const week = await prisma.user.findUnique({
    where: {
      id: +userId!,
    },
    select: {
      week: {
        select: {
          mondayFreeMinutes: true,
          tuesdayFreeMinutes: true,
          wednesdayFreeMinutes: true,
          thursdayFreeMinutes: true,
          fridayFreeMinutes: true,
          saturdayFreeMinutes: true,
          sundayFreeMinutes: true,
        },
      },
    },
  });
  res.json(week);
};

export const findfreeMinutesInDay = (
  date: moment.Moment,
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
  const dayOfTheWeek = date.day();
  switch (dayOfTheWeek) {
    case 0: {
      return week.sundayFreeMinutes;
    }
    case 1: {
      return week.mondayFreeMinutes;
    }
    case 2: {
      return week.tuesdayFreeMinutes;
    }
    case 3: {
      return week.wednesdayFreeMinutes;
    }
    case 4: {
      return week.thursdayFreeMinutes;
    }
    case 5: {
      return week.fridayFreeMinutes;
    }
    case 6: {
      return week.saturdayFreeMinutes;
    }
  }
  return 0;
};

export const fetchWeek = async (userId: number) => {
  return await prisma.week.findUnique({
    where: {
      userId: userId,
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
};
