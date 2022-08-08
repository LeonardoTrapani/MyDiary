import { Request, Response, NextFunction } from 'express';
import { addDays, addDaysFromToday, throwResponseError } from '../utilities';

import { prisma } from '../app';

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
      //Search a day with same userId and planned date
      const freeDay = await fetchFreeDay(plannedDate.date, +userId!);
      if (freeDay) {
        //If it exists edit the minutes
        return await updateExistingDay(
          plannedDate.date,
          freeDay.freeMinutes,
          plannedDate.minutes,
          +userId!
        );
      }

      //If it doesn't exists create one
      return await createDayWithUpdatedDuration(
        plannedDate.date,
        +userId!,
        plannedDate.minutes
      );
    });

    const homework = await prisma.homework.create({
      data: {
        userId: +userId!,
        description,
        duration: duration,
        expirationDate: new Date(expirationDate),
        name: name,
        subjectId: subject.id,
        plannedDates: {
          createMany: {
            data: plannedDates,
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
  console.log('YE');
  const { expirationDate: expirationDateBody } = req.body;
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

    // const daysFromTodayWithSubtractedDays =
    //   daysFromToday + calculateSubtractedDays(+pageNumber, week, freeDays);
    // const startDate = addDaysFromToday(daysFromTodayWithSubtractedDays); //THIS DOESN'T SHOW DAYS WITH LESS THAN 1 MIN

    const startDate = addDaysFromToday(daysFromToday);

    const freeDaysArray = getFreeDaysArray(
      startDate,
      expirationDate,
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
    freeMinutes: number;
  }[];
}

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
          freeMinutes: true,
        },
        where: {
          deleted: false,
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      },
    },
  });
};
export const getFreeDaysArray = (
  startDate: Date,
  expirationDate: Date,
  week: week,
  freeDays: freeDays,
  daysPerPage: number
) => {
  const finalFreeDays: {
    date: Date;
    freeMinutes: number;
  }[] = [];
  let currentDate = startDate;
  while (currentDate < expirationDate && finalFreeDays.length < daysPerPage) {
    const freeMinutes = findfreeMinutesInDay(currentDate, week);
    const freeDayToPut = freeDays.days.find((day) => {
      return day.date.toDateString() === currentDate.toDateString();
    });
    // const isDayValid = calculateIsDayValid(
    //   freeDayToPut,
    //   // homeworkDuration,
    //   freeMinutes
    // );
    // if (isDayValid) {
    if (freeDayToPut) {
      finalFreeDays.push(freeDayToPut);
    } else {
      finalFreeDays.push({
        date: currentDate,
        freeMinutes,
      });
    }
    // }
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

// const calculateSubtractedDays = (
//   pageNumber: number,
//   week: week,
//   freeDays: freeDays
// ) => {
//   if (pageNumber === 1) {
//     return 0;
//   }
//   const maxLength = pageNumber * DAYS_PER_PAGE - DAYS_PER_PAGE;
//   let currentDate = new Date();
//   let daysToSkip = 0;
//   let length = 0;
//   while (length < maxLength) {
//     const freeMinutes = findfreeMinutesInDay(currentDate, week);
//     const freeDayToPut = freeDays.days.find((day) => {
//       return day.date.toDateString() === currentDate.toDateString();
//     });
//     const isDayValid = calculateIsDayValid(
//       freeDayToPut,
//       // homeworkDuration,
//       freeMinutes
//     );
//     if (isDayValid) {
//       length++;
//     } else {
//       daysToSkip++;
//     }
//     currentDate = addDays(currentDate, 1);
//   }

//   return daysToSkip;
// };

// const calculateIsDayValid = (
//   freeDayToPut:
//     | {
//         date: Date;
//         freeMinutes: number;
//       }
//     | undefined,
//   // homeworkDuration: number,
//   freeMinutes: number
// ) => {
//   if (freeDayToPut) {
//     if (freeDayToPut.freeMinutes > 0) {
//       return true;
//     }
//   }
//   if (freeMinutes > 0) {
//     return true;
//   }
//   return false;
// };

const fetchFreeDay = async (date: string, userId: number) => {
  const freeDay = await prisma.day.findFirst({
    where: {
      userId,
      date,
      deleted: false,
    },
  });

  return freeDay;
};

const updateExistingDay = async (
  date: string,
  previousMinutes: number,
  assignedMinutes: number,
  userId: number
) => {
  return await prisma.day.updateMany({
    where: {
      userId: userId,
      date,
      deleted: false,
    },
    data: {
      freeMinutes: previousMinutes - assignedMinutes,
    },
  });
};

const createDayWithUpdatedDuration = async (
  date: string,
  userId: number,
  assignedMinutes: number
) => {
  const week = await prisma.week.findUnique({
    where: {
      userId: userId,
    },
  });
  if (!week) {
    console.error("can't find the week", userId);
    return;
  }
  const freeMinutesInDay = findfreeMinutesInDay(new Date(date), week);
  return await prisma.day.create({
    data: {
      userId: userId,
      date,
      freeMinutes: freeMinutesInDay - assignedMinutes,
    },
  });
};
