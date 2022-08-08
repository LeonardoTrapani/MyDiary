import { Request, Response } from 'express';
import { addDays, removeDays, throwResponseError } from '../utilities';
import { prisma } from '../app';
import { fetchFreeDays, fetchWeek, getFreeDaysArray } from './homework';

type Calendar = {
  disabled: boolean;
  date: Date;
  freeTime: number;
  homework: CalendarHomework[];
}[];

interface CalendarHomework {
  homeworkId: number;
  minutesOccupied: number;
  name: string;
  subject: string;
  subjectColor: string;
}

const isCalendarDayDisabled = (date: Date, month: number) => {
  const currDate = new Date();
  if (date <= currDate || date.getMonth() !== month) {
    return true;
  }
  return false;
};
const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};
const getFirstDayOfMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  return firstDay;
};

const getLastDayOfMonth = (year: number, month: number) => {
  const lastDay = new Date(year, month + 1, 0);
  return addDays(lastDay, 1);
};

const DAYS_PER_PAGE = 35;
export const getCalendar = async (req: Request, res: Response) => {
  const { userId } = req;
  const { page } = req.params;
  const pageNumber = +page!;
  const currDate = new Date();

  const firstDayInMonth = getFirstDayOfMonth(
    currDate.getFullYear(),
    currDate.getMonth() + pageNumber - 1
  );
  const lastDayInMonth = getLastDayOfMonth(
    currDate.getFullYear(),
    currDate.getMonth() + pageNumber - 1
  );

  const daysInMonth = getDaysInMonth(
    currDate.getMonth() + pageNumber,
    currDate.getFullYear()
  );
  const daysToRemoveStart = firstDayInMonth.getDay() - 1;
  const daysToAddEnd = DAYS_PER_PAGE - daysInMonth;
  const firstDay = removeDays(firstDayInMonth, daysToRemoveStart);
  const lastDay = addDays(lastDayInMonth, daysToAddEnd);
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
        subject: hmk.subject.name,
        subjectColor: hmk.subject.color,
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
    DAYS_PER_PAGE
  );
  calendarDays.forEach((calendarDay, i) => {
    calendar.push({
      date: calendarDay.date,
      freeTime: calendarDay.freeMinutes,
      disabled: isCalendarDayDisabled(
        calendarDay.date,
        firstDayInMonth.getMonth()
      ),
      homework: homeworkInDays[i],
    });
  });

  res.json(calendar);
};
