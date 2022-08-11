import { Request, Response, NextFunction } from 'express';
import { throwResponseError } from '../utilities';

import { prisma } from '../app';
import moment from 'moment';
import { createOrUpdateDayCountingPreviousMinutes } from './day';
import { fetchWeek, findfreeMinutesInDay } from './week';

export const createHomework = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { name, subjectId, duration, description, expirationDate } = req.body;
  const plannedDates = req.body.plannedDates as {
    minutes: number;
    date: string;
  }[];

  try {
    const subject = await prisma.subject.findUnique({
      where: {
        id: +subjectId!,
      },
    });
    if (!subject) {
      return throwResponseError(
        "can't find the subject you selected",
        400,
        res
      );
    }

    plannedDates.forEach(async (plannedDate) => {
      await createOrUpdateDayCountingPreviousMinutes(
        +userId!,
        plannedDate.date,
        plannedDate.minutes,
        res
      );
    });

    const formattedPlannedDates = plannedDates.map((plannedDate) => {
      return {
        minutesAssigned: plannedDate.minutes,
        date: moment(plannedDate.date).startOf('day').toISOString(),
      };
    });

    const homework = await prisma.homework.create({
      data: {
        userId: +userId!,
        description,
        duration: duration,
        expirationDate: moment(expirationDate).startOf('day').toDate(),
        name: name,
        subjectId: subject.id,
        plannedDates: {
          createMany: {
            data: formattedPlannedDates,
          },
        },
      },
    });
    return res.json(homework);
  } catch (err) {
    console.error(err);
    return throwResponseError('unable to create homework', 500, res);
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
      deleted: false,
    },
    select: {
      id: true,
      name: true,
      description: true,
      subject: true,
      expirationDate: true,
      plannedDates: true,
      duration: true,
      completed: true,
    },
  });
  res.json(homework);
};

const DAYS_PER_PAGE = 9;
export const calculateFreeDays = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { expirationDate: expirationDateBody } = req.body;
  const { pageNumber } = req.params;
  const expirationDate = moment(expirationDateBody);
  const { userId } = req;
  try {
    const week = await fetchWeek(+userId!);
    if (!week) {
      return throwResponseError(
        'please define your usual week before creating any homework',
        400,
        res
      );
    }
    const freeDays = await fetchFreeDays(+userId!);

    if (!freeDays) {
      return throwResponseError(
        "an error has occurred: can't find free days",
        400,
        res
      );
    }

    const daysFromToday = +pageNumber * DAYS_PER_PAGE - DAYS_PER_PAGE;

    const startDate = moment().add(daysFromToday, 'days').startOf('days');

    const freeDaysArray = getFreeDaysArray(
      startDate.clone(),
      expirationDate.clone(),
      week,
      freeDays,
      DAYS_PER_PAGE
    );

    return res.json(freeDaysArray);
  } catch (err) {
    return throwResponseError(
      'an error has occurred finding the free hours',
      400,
      res
    );
  }
};

interface week {
  id: number;
  mondayFreeMinutes: number;
  tuesdayFreeMinutes: number;
  wednesdayFreeMinutes: number;
  thursdayFreeMinutes: number;
  fridayFreeMinutes: number;
  saturdayFreeMinutes: number;
  sundayFreeMinutes: number;
}
interface freeDays {
  days: {
    date: Date;
    freeMins: number;
    minutesToAssign: number;
  }[];
}

export const fetchFreeDays = async (userId: number) => {
  return await prisma.user.findFirst({
    where: {
      id: userId,
      deleted: false,
    },
    select: {
      days: {
        select: {
          date: true,
          freeMins: true,
          minutesToAssign: true,
        },
        where: {
          deleted: false,
          date: {
            gte: moment().startOf('day').toDate(),
          },
        },
      },
    },
  });
};
export const getFreeDaysArray = (
  startDate: moment.Moment,
  expirationDate: moment.Moment,
  week: week,
  freeDays: freeDays,
  daysPerPage: number
) => {
  const finalFreeDays: {
    date: Date;
    freMins: number;
    minutesToAssign: number;
  }[] = [];
  let currentDate = startDate;
  while (
    currentDate.isSameOrBefore(expirationDate, 'days') &&
    finalFreeDays.length < daysPerPage
  ) {
    const freeMinutes = findfreeMinutesInDay(currentDate, week);
    const freeDayToPut = freeDays.days.find((day) => {
      const freeDaysDay = moment(day.date);
      return freeDaysDay.isSame(currentDate, 'days');
    });
    if (freeDayToPut) {
      finalFreeDays.push({
        date: moment(freeDayToPut.date).toDate(),
        freMins: freeDayToPut.freeMins,
        minutesToAssign: freeDayToPut.minutesToAssign,
      });
    } else {
      finalFreeDays.push({
        date: currentDate.toDate(),
        freMins: freeMinutes,
        minutesToAssign: freeMinutes,
      });
    }
    currentDate = currentDate.add(1, 'day');
  }
  return finalFreeDays;
};
