import { Request, Response } from "express";
import { throwResponseError } from "../utilities";

import { prisma } from "../app";
import moment from "moment";

import { createOrUpdateDayCountingPreviousMinutes } from "./day";
import { fetchWeek, findfreeMinutesInDay } from "./week";

export const createHomework = async (req: Request, res: Response) => {
  const { userId } = req;
  const { name, subjectId, duration, description, expirationDate } = req.body;
  const plannedDates = req.body.plannedDates as {
    minutes: number;
    date: string;
  }[];

  try {
    await prisma.$transaction(async (trx) => {
      const subject = await trx.subject.findUnique({
        where: {
          id: +subjectId!,
        },
      });
      if (!subject) {
        throw "Can't find the subject";
      }

      for (let i = 0; i < plannedDates.length; i++) {
        await createOrUpdateDayCountingPreviousMinutes(
          +userId!,
          plannedDates[i].date,
          plannedDates[i].minutes,
          res,
          trx
        );
      }

      const formattedPlannedDates = plannedDates.map((plannedDate) => {
        return {
          minutesAssigned: plannedDate.minutes,
          date: moment(plannedDate.date).startOf("day").toISOString(),
        };
      });

      await trx.homework.create({
        data: {
          userId: +userId!,
          description,
          duration: duration,
          timeToComplete: duration,
          expirationDate: moment(expirationDate).startOf("day").toDate(),
          name: name,
          subjectId: subject.id,
          plannedDates: {
            createMany: {
              data: formattedPlannedDates,
            },
          },
        },
      });
    });
    return res.json(true);
  } catch (err) {
    console.error(err);
    return throwResponseError("unable to create homework", 500, res);
  }
};

export const createHomeworkWihoutPlan = async (req: Request, res: Response) => {
  const { userId } = req;
  const { name, subjectId, description, expirationDate } = req.body;

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

    const homework = await prisma.homework.create({
      data: {
        userId: +userId!,
        description,
        expirationDate: moment(expirationDate).startOf("day").toDate(),
        name: name,
        subjectId: subject.id,
      },
    });
    return res.json(homework);
  } catch (err) {
    console.error(err);
    return throwResponseError("unable to create homework", 500, res);
  }
};

export const planHomework = async (req: Request, res: Response) => {
  const { userId } = req;
  const { duration, homeworkId } = req.body;
  const plannedDates = req.body.plannedDates as {
    minutes: number;
    date: string;
  }[];

  try {
    await prisma.$transaction(async (trx) => {
      console.log("6");
      await trx.plannedDate.deleteMany({
        where: {
          homeworkId,
        },
      });
      console.log("5");

      plannedDates.forEach(async (plannedDate) => {
        console.log("4");
        await createOrUpdateDayCountingPreviousMinutes(
          +userId!,
          plannedDate.date,
          plannedDate.minutes,
          res,
          trx
        );
      });

      const formattedPlannedDates = plannedDates.map((plannedDate) => {
        return {
          minutesAssigned: plannedDate.minutes,
          date: moment(plannedDate.date).startOf("day").toISOString(),
        };
      });

      console.log("3");
      await trx.homework.updateMany({
        where: {
          id: homeworkId,
          userId: +userId!,
        },
        data: {
          duration: duration,
          timeToComplete: duration,
        },
      });
      console.log("2");
      formattedPlannedDates.forEach(async (plannedDate) => {
        console.log("1");
        await trx.plannedDate.create({
          data: {
            date: plannedDate.date,
            minutesAssigned: plannedDate.minutesAssigned,
            homeworkId: homeworkId,
          },
        });
      });
    });
    console.log("0");
    return res.json("success");
  } catch (err) {
    console.log("-1");
    return throwResponseError("unable to create homework", 500, res);
  }
};

export const getAllHomework = async (req: Request, res: Response) => {
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
      timeToComplete: true,
      plannedDates: true,
      duration: true,
      completed: true,
    },
  });
  res.json(homework);
};

export const CONTS_DAYS_PER_PAGE = 9;

export const calculateFreeDays = async (req: Request, res: Response) => {
  const { expirationDate: expirationDateBody } = req.body;
  let daysPerPage = req.body.daysPerPage || CONTS_DAYS_PER_PAGE;
  const { pageNumber } = req.params;
  const expirationDate = moment(expirationDateBody).subtract(1, "day");
  const { userId } = req;
  try {
    const week = await fetchWeek(+userId!);
    if (!week) {
      return throwResponseError(
        "please define your usual week before creating any homework",
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

    const daysFromToday = +pageNumber * daysPerPage - daysPerPage;

    const startDate = moment().add(daysFromToday, "days").startOf("days");

    const { nextDay, freeDays: freeDaysArray } = getFreeDaysArray(
      startDate.clone(),
      expirationDate.clone(),
      week,
      freeDays,
      daysPerPage
    );

    const isLastPage = !nextDay;
    const finalResponse: FreeDaysResponse = {
      nextCursor: isLastPage ? undefined : +pageNumber + 1,
      page: {
        freeDays: freeDaysArray,
      },
    };
    return res.json(finalResponse);
  } catch (err) {
    return throwResponseError(
      "an error has occurred finding the free hours",
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
type FreeDays = FreeDay[];

interface FreeDay {
  date: Date;
  freeMins: number;
  minutesToAssign: number;
}

export type FreeDaysResponse = {
  nextCursor: number | undefined;
  page: {
    freeDays: FreeDays;
  };
};

export const fetchFreeDays = async (userId: number) => {
  const res = await prisma.user.findFirst({
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
            gte: moment().startOf("day").toDate(),
          },
        },
      },
    },
  });
  return res?.days;
};
export const getFreeDaysArray = (
  startDate: moment.Moment,
  expirationDate: moment.Moment,
  week: week,
  freeDays: FreeDays,
  daysPerPage: number
) => {
  const finalFreeDays: {
    date: Date;
    freeMins: number;
    minutesToAssign: number;
  }[] = [];
  let currentDate = startDate;
  while (
    currentDate.isSameOrBefore(expirationDate, "days") &&
    finalFreeDays.length < daysPerPage
  ) {
    const { freeDayToPut, freeMinutes } = getOneFreeDay(
      currentDate,
      week,
      freeDays
    );
    if (freeDayToPut) {
      finalFreeDays.push({
        date: moment(freeDayToPut.date).toDate(),
        freeMins: freeDayToPut.freeMins,
        minutesToAssign: freeDayToPut.minutesToAssign,
      });
    } else {
      finalFreeDays.push({
        date: currentDate.toDate(),
        freeMins: freeMinutes,
        minutesToAssign: freeMinutes,
      });
    }
    currentDate = currentDate.add(1, "day");
  }
  const nextDay = getOneFreeDay(currentDate, week, freeDays);
  if (currentDate.isAfter(expirationDate, "days")) {
    return { freeDays: finalFreeDays, nextDay: null };
  }
  return { freeDays: finalFreeDays, nextDay };
};

export const getOneFreeDay = (
  currentDate: moment.Moment,
  week: week,
  freeDays: FreeDays
) => {
  const freeMinutes = findfreeMinutesInDay(currentDate, week);
  const freeDayToPut = freeDays.find((day) => {
    const freeDaysDay = moment(day.date);
    return freeDaysDay.isSame(currentDate, "days");
  });
  return { freeMinutes, freeDayToPut };
};

export const getSingleHomework = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req;

  const numUserId = +userId!;

  const singleHomework = await prisma.homework.findFirst({
    where: {
      id: +id,
      userId: numUserId,
    },
    select: {
      completed: true,
      id: true,
      description: true,
      duration: true,
      expirationDate: true,
      timeToComplete: true,
      subject: {
        select: {
          id: true,
          color: true,
          name: true,
        },
      },
      plannedDates: {
        select: {
          date: true,
          minutesAssigned: true,
          completed: true,
          id: true,
        },
        where: {
          deleted: false,
        },
      },
      name: true,
    },
  });
  if (!singleHomework) {
    return throwResponseError("Could not find the homework", 400, res);
  }
  res.json(singleHomework);
  return;
};

export const completeHomework = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.$transaction(async (trx) => {
    await trx.homework.update({
      where: {
        id: +id,
      },
      data: {
        completed: true,
        timeToComplete: 0,
      },
    });
    await trx.plannedDate.updateMany({
      where: {
        homework: {
          id: +id!,
        },
      },
      data: {
        completed: true,
      },
    });
  });
  res.json("success");
  return;
};

export const uncompleteHomework = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.$transaction(async (trx) => {
    const previousHomework = await trx.homework.findUnique({
      where: { id: +id },
    });

    if (!previousHomework) {
      throwResponseError("homework doesnt exist", 400, res);
      return;
    }

    await trx.homework.update({
      where: {
        id: +id,
      },
      data: {
        completed: false,
        timeToComplete: previousHomework.duration,
      },
    });

    await trx.plannedDate.updateMany({
      where: {
        homework: {
          id: +id!,
        },
      },
      data: {
        completed: false,
      },
    });
  });

  res.json("success");
  return;
};
