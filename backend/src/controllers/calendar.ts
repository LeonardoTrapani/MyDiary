import { Request, Response } from "express";
import { throwResponseError } from "../utilities";
import { prisma } from "../app";
import { fetchFreeDays, getFreeDaysArray } from "./homework";
import { Moment } from "moment";
import moment from "moment";
import { fetchWeek, findfreeMinutesInDay } from "./week";

type Calendar = CalendarDay[];

interface CalendarDay {
  disabled: boolean;
  date: Moment;
  freeMins: number;
  minutesToAssign: number;
  homework: CalendarHomework[];
}

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
    .add(pageNumber - 1, "months")
    .startOf("month");
  const endOfMonth = moment()
    .add(pageNumber - 1, "months")
    .endOf("month")
    .startOf("day");

  const daysInMonth = moment()
    .add(pageNumber - 1, "months")
    .daysInMonth();
  // const daysToRemoveStart = startOfMonth.diff(currDate, 'days');
  const daysToAddEnd = DAYS_PER_PAGE - daysInMonth;
  // const firstDay = startOfMonth.subtract(daysToRemoveStart, 'days');
  const lastDay = endOfMonth.add(daysToAddEnd, "days");
  let currentDate = moment(startOfMonth).startOf("day");

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
            minutesAssigned: true,
          },
        },
      },
    });

    const formattedHomework: CalendarHomework[] = homework.map((hmk) => {
      return {
        homeworkId: hmk.id,
        minutesOccupied: hmk.plannedDates[0].minutesAssigned,
        name: hmk.name,
        subject: hmk.subject.name,
        subjectColor: hmk.subject.color,
      };
    });

    homeworkInDays.push(formattedHomework);
    currentDate = currentDate.add(1, "day");
  }

  const week = await fetchWeek(+userId!);
  if (!week) {
    throwResponseError("please define your usual week", 400, res);
    return;
  }
  const freeDays = await fetchFreeDays(+userId!);

  if (!freeDays) {
    throwResponseError("an error has occurred: can't find free days", 400, res);
    return;
  }

  const { freeDays: calendarDays } = getFreeDaysArray(
    startOfMonth.clone(),
    endOfMonth.clone(),
    week,
    freeDays,
    DAYS_PER_PAGE
  );

  calendarDays.forEach((calendarDay, i) => {
    calendar.push({
      date: moment(calendarDay.date),
      freeMins: calendarDay.freeMins,
      minutesToAssign: calendarDay.minutesToAssign,
      disabled: isCalendarDayDisabled(
        moment(calendarDay.date),
        startOfMonth.month(),
        calendarDay.freeMins,
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
  const currDate = moment().startOf("day");
  if (
    date.isBefore(currDate.subtract(1, "days")) ||
    date.month() !== month ||
    (freeMinutes <= 0 && !homeworkInDays.length)
  ) {
    return true;
  }
  return false;
};

export const getSingleCalendarDay = async (req: Request, res: Response) => {
  const { userId } = req;
  const { date: requestDate } = req.params;
  const date = moment(requestDate).startOf("day");

  const day = await prisma.day.findFirst({
    where: {
      userId: +userId!,
      date: date.startOf("day").toISOString(),
    },
    select: {
      date: true,
      freeMins: true,
      minutesToAssign: true,
      user: {
        select: {
          homework: {
            where: {
              deleted: false,
              subject: {
                deleted: false,
              },
              plannedDates: {
                some: {
                  date: date.startOf("day").toISOString(),
                  AND: {
                    deleted: false,
                  },
                },
              },
            },
            select: {
              completed: true,
              id: true,
              description: true,
              expirationDate: true,
              duration: true,
              timeToComplete: true,
              name: true,
              subject: {
                select: {
                  name: true,
                  color: true,
                  id: true,
                },
              },
              plannedDates: {
                where: {
                  date: date.startOf("day").toISOString(),
                  deleted: false,
                },
                select: {
                  date: true,
                  id: true,
                  completed: true,
                  minutesAssigned: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (day) {
    res.json(day);
    return;
  }
  const week = await fetchWeek(+userId!);
  if (!week) {
    throwResponseError("the week does not exist", 400, res);
    return;
  }
  const freeMinsInDay = findfreeMinutesInDay(date, week);
  res.json({
    date,
    freeMins: freeMinsInDay,
    minutesToAssign: freeMinsInDay,
    user: {
      homework: [],
    },
  });
};
