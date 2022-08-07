import { Request, Response, NextFunction } from 'express';
import { addDays, addDaysFromToday, throwResponseError } from '../utilities';
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
}

const DAYS_PER_PAGE = 7;
export const getCalendar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { page } = req.params;
  const pageNumber = +page!;
  const daysFromToday = +pageNumber * DAYS_PER_PAGE - DAYS_PER_PAGE;
  const startDate = addDaysFromToday(daysFromToday);
  let currentDate = new Date(startDate);
  const endDate = addDaysFromToday(daysFromToday + DAYS_PER_PAGE);
  const homeworkInDays: CalendarHomework[][] = [];
  const calendar: Calendar = [];
  while (currentDate <= endDate) {
    let initialDate = new Date(currentDate.setHours(0, 0, 0, 0));
    let endDate = new Date(addDays(currentDate, 1).setHours(0, 0, 0, 0));
    const homework = await prisma.homework.findMany({
      where: {
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

  const calendarWeek = getFreeDaysArray(startDate, endDate, week, freeDays);

  for (let i = 0; i < DAYS_PER_PAGE; i++) {
    calendar.push({
      date: calendarWeek[i].date,
      freeTime: calendarWeek[i].freeMinutes,
      homework: homeworkInDays[i],
    });
  }
  res.json(calendar);
};
