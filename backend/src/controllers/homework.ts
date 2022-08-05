import { Request, Response, NextFunction } from 'express';
import { addDays, addDaysFromToday, throwResponseError } from '../utilities';

import { prisma } from '../app';

export const createHomework = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { name, subject, duration, description, expirationDate } = req.body;
  const plannedDates = req.body.plannedDates as {
    minutes: number;
    date: string;
  }[];
  const userIdNumber = +userId!;

  try {
    // -----------------TODO: FIX------------------ //
    plannedDates.forEach(async (plannedDate) => {
      const day = await fetchDayAndUpdateIfExists(
        plannedDate.date,
        plannedDate.minutes,
        +userId!
      );
      if (!day) {
        //CREATE DAY WITH UPDATED DURATION
        await createDayWithUpdatedDuration(
          plannedDate.date,
          plannedDate.minutes,
          +userId!
        );
      }
    });
    // --------------------------------------- //
    const homework = await prisma.user.update({
      where: {
        id: userIdNumber,
      },
      select: {
        homework: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            completed: true,
            description: true,
            duration: true,
            expirationDate: true,
            id: true,
            name: true,
            plannedDates: true,
            subject: true,
          },
          where: {
            user: {
              deleted: false,
            },
            deleted: false,
          },
        },
      },
      data: {
        homework: {
          create: {
            description,
            duration: duration,
            expirationDate: new Date(expirationDate),
            name: name,
            subject: subject,
            plannedDates: {
              createMany: {
                data: plannedDates,
              },
            },
          },
        },
      },
    });
    res.json(homework.homework[0]);
  } catch (err) {
    console.log(err);
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
      AND: {
        deleted: false,
      },
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
  const { expirationDate: expirationDateBody, duration: homeworkDuration } =
    req.body;
  const { pageNumber } = req.params;
  const expirationDate = new Date(expirationDateBody);

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

    const daysFromTodayWithSubtractedDays =
      daysFromToday +
      calculateSubtractedDays(+pageNumber, week, freeDays, homeworkDuration);
    const startDate = addDaysFromToday(daysFromTodayWithSubtractedDays);

    const freeDaysArray = getFreeDaysArray(
      startDate,
      expirationDate,
      week,
      freeDays
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
    freeMinutes: number;
  }[];
}

const fetchWeek = async (userId: number) => {
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
const fetchFreeDays = async (userId: number) => {
  return await prisma.user.findFirst({
    where: {
      id: userId,
      deleted: false,
    },
    select: {
      days: {
        select: {
          date: true,
          freeMinutes: true,
        },
        where: {
          date: {
            gte: new Date(),
          },
        },
      },
    },
  });
};
const getFreeDaysArray = (
  startDate: Date,
  expirationDate: Date,
  week: week,
  freeDays: freeDays
) => {
  const finalFreeDays: {
    date: Date;
    freeMinutes: number;
  }[] = [];
  let currentDate = startDate;
  while (currentDate < expirationDate && finalFreeDays.length < DAYS_PER_PAGE) {
    const freeMinutes = findfreeMinutesInDay(currentDate, week);
    const freeDayToPut = freeDays.days.find((day) => {
      return day.date.toDateString() === currentDate.toDateString();
    });
    const isDayValid = calculateIsDayValid(
      // freeDayToPut,
      // homeworkDuration,
      freeMinutes
    );
    if (isDayValid) {
      if (freeDayToPut) {
        finalFreeDays.push(freeDayToPut);
      } else {
        finalFreeDays.push({
          date: currentDate,
          freeMinutes,
        });
      }
    }
    currentDate = addDays(currentDate, 1);
  }

  return finalFreeDays;
};

const findfreeMinutesInDay = (
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
  const dayOfTheWeek = date.getDay();
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
// if already created remove then
const calculateSubtractedDays = (
  pageNumber: number,
  week: week,
  freeDays: freeDays,
  homeworkDuration: number
) => {
  if (pageNumber === 1) {
    return 0;
  }
  const maxLength = pageNumber * DAYS_PER_PAGE - DAYS_PER_PAGE;
  let currentDate = new Date();
  let daysToSkip = 0;
  let length = 0;
  while (length < maxLength) {
    const freeMinutes = findfreeMinutesInDay(currentDate, week);
    // const freeDayToPut = freeDays.days.find((day) => {
    //   return day.date.toDateString() === currentDate.toDateString();
    // });
    const isDayValid = calculateIsDayValid(
      // freeDayToPut,
      // homeworkDuration,
      freeMinutes
    );
    if (isDayValid) {
      length++;
    } else {
      daysToSkip++;
    }
    currentDate = addDays(currentDate, 1);
  }

  return daysToSkip;
};

const calculateIsDayValid = (
  // freeDayToPut:
  //   | {
  //       date: Date;
  //       freeMinutes: number;
  //     }
  //   | undefined,
  // homeworkDuration: number,
  freeMinutes: number
) => {
  // if (freeDayToPut) {
  //   if (freeDayToPut.freeMinutes >= homeworkDuration) {
  //     return true;
  //   }
  // } else if (freeMinutes >= homeworkDuration) {
  //   return true;
  // }
  // return false;  REMOVED BECAUSE SOMEONE SHOULD BE ABLE TO ASSIGN 5 MINUTES TO A DAY
  if (freeMinutes >= 5) {
    return true;
  }
  return false;
};

const fetchDayAndUpdateIfExists = async (
  date: string,
  minutes: number,
  userId: number
) => {
  const freeMinutes = await prisma.day.findFirst({
    where: {
      userId: userId,
      date,
    },
    select: { freeMinutes: true },
  });
  if (!freeMinutes) {
    return;
  }

  return await prisma.day.updateMany({
    where: {
      userId: userId,
      date,
    },
    data: {
      freeMinutes: freeMinutes.freeMinutes - minutes,
    },
  });
};

const createDayWithUpdatedDuration = async (
  date: string,
  minutes: number,
  userId: number
) => {
  const week = await prisma.week.findUnique({
    where: {
      userId: userId,
    },
  });
  if (!week) {
    return;
  }
  const freeMinutesInDay = findfreeMinutesInDay(new Date(date), week);
  return await prisma.day.create({
    data: {
      userId: userId,
      date,
      freeMinutes: freeMinutesInDay - minutes,
    },
  });
};
