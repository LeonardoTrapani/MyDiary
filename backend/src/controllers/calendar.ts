import { Request, Response, NextFunction } from 'express';
import { addDays, throwResponseError } from '../utilities';
import { prisma } from '../app';
import { fetchFreeDays, fetchWeek, getFreeDaysArray } from './homework';

type Calendar = {
  date: Date;
  freeTime: number;
  homework: CalendarHomework[];
}[];

interface CalendarHomework {
  homeworkId: number;
  minutesOccupied: number;
  name: string;
  subject: string;
}

const daysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};
const getFirstDayOfMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  return firstDay;
};

const getLastDayOfMonth = (year: number, month: number) => {
  const lastDay = new Date(year, month + 1, 0);
  return lastDay;
};

export const getCalendar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { page } = req.params;
  const pageNumber = +page!;
  const currDate = new Date();

  const daysPerPage = daysInMonth(
    currDate.getMonth() + pageNumber - 1,
    currDate.getFullYear()
  );
  const firstDay = getFirstDayOfMonth(
    currDate.getFullYear(),
    currDate.getMonth()
  );
  const lastDay = getLastDayOfMonth(
    currDate.getFullYear(),
    currDate.getMonth()
  );
  console.log({ firstDay, lastDay });
  let currentDate = new Date(firstDay);
  const homeworkInDays: CalendarHomework[][] = [];
  const calendar: Calendar = [];
  while (currentDate <= lastDay) {
    let initialDate = new Date(currentDate.setHours(0, 0, 0, 0));
    let endDate = new Date(addDays(currentDate, 1).setHours(0, 0, 0, 0));
    const homework = await prisma.homework.findMany({
      where: {
        completed: false,
        userId: +userId!,
        plannedDates: {
          some: {
            date: {
              gte: initialDate,
              lt: endDate,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        subject: true,
        plannedDates: {
          where: {
            deleted: false,
            date: {
              gte: initialDate,
              lt: endDate,
            },
          },
          select: {
            minutes: true,
          },
        },
      },
    });
    const formattedHomework: CalendarHomework[] = homework.map((hmk) => {
      return {
        homeworkId: hmk.id,
        minutesOccupied: hmk.plannedDates[0].minutes,
        name: hmk.name,
        subject: hmk.subject,
      };
    });
    homeworkInDays.push(formattedHomework);
    currentDate = addDays(currentDate, 1);
  }

  const week = await fetchWeek(+userId!);
  if (!week) {
    throwResponseError('please define your usual week', 400, res);
    return;
  }
  const freeDays = await fetchFreeDays(+userId!);

  if (!freeDays) {
    throwResponseError("an error has occurred: can't find free days", 400, res);
    return;
  }

  const calendarDays = getFreeDaysArray(
    firstDay,
    lastDay,
    week,
    freeDays,
    daysPerPage
  );
  console.log(calendarDays);
  calendarDays.forEach((calendarDay, i) => {
    calendar.push({
      date: calendarDay.date,
      freeTime: calendarDay.freeMinutes,
      homework: homeworkInDays[i],
    });
  });

  res.json(calendar);
};
