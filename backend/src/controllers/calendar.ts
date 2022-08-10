import { Request, Response } from 'express';
import { throwResponseError } from '../utilities';
import { prisma } from '../app';
import { fetchFreeDays, fetchWeek, getFreeDaysArray } from './homework';
import { Moment } from 'moment';
import moment from 'moment';

type Calendar = {
  disabled: boolean;
  date: Moment;
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

const DAYS_PER_PAGE = 35;
export const getCalendar = async (req: Request, res: Response) => {
  const { userId } = req;
  const { page } = req.params;
  const pageNumber = +page!;

  const startOfMonth = moment()
    .add(pageNumber - 1, 'months')
    .startOf('month');
  const endOfMonth = moment()
    .add(pageNumber - 1, 'months')
    .endOf('month')
    .startOf('day');

  const daysInMonth = moment()
    .add(pageNumber - 1, 'months')
    .daysInMonth();
  // const daysToRemoveStart = startOfMonth.diff(currDate, 'days');
  const daysToAddEnd = DAYS_PER_PAGE - daysInMonth;
  // const firstDay = startOfMonth.subtract(daysToRemoveStart, 'days');
  const lastDay = endOfMonth.add(daysToAddEnd, 'days');
  let currentDate = moment(startOfMonth).startOf('day');

  const homeworkInDays: CalendarHomework[][] = [];
  const calendar: Calendar = [];
  while (currentDate.isSameOrBefore(lastDay)) {
    const homework = await prisma.homework.findMany({
      where: {
        completed: false,
        userId: +userId!,
        plannedDates: {
          some: {
            date: currentDate.toDate(),
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
            date: currentDate.toDate(),
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
    currentDate = currentDate.add(1, 'day');
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
    startOfMonth.clone(),
    endOfMonth.clone(),
    week,
    freeDays,
    DAYS_PER_PAGE
  );

  calendarDays.forEach((calendarDay, i) => {
    calendar.push({
      date: moment(calendarDay.date),
      freeTime: calendarDay.freeMinutes,
      disabled: isCalendarDayDisabled(
        moment(calendarDay.date),
        startOfMonth.month(),
        calendarDay.freeMinutes,
        homeworkInDays[i]
      ),
      homework: homeworkInDays[i],
    });
  });

  res.json(calendar);
};

const isCalendarDayDisabled = (
  date: Moment,
  month: number,
  freeMinutes: number,
  homeworkInDays: CalendarHomework[]
) => {
  const currDate = moment();
  if (
    date.isBefore(currDate) ||
    date.month() !== month ||
    (freeMinutes <= 0 && !homeworkInDays.length)
  ) {
    return true;
  }
  return false;
};
