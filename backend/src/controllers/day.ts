import { Request, Response } from "express";
import { isPositiveNotZero, throwResponseError } from "../utilities";
import { prisma } from "../app";
import moment from "moment";
import { fetchWeek, findfreeMinutesInDay } from "./week";
import { Prisma } from "@prisma/client";

export const getAllDays = async (req: Request, res: Response) => {
  const { userId } = req;
  try {
    const days = await prisma.day.findMany({
      where: {
        userId: +userId!,
      },
      select: {
        date: true,
        freeMins: true,
        minutesToAssign: true,
        id: true,
      },
    });
    res.json(days);
  } catch (err) {
    throwResponseError("an error has occurred fetching the days", 400, res);
  }
};

export const createDay = async (req: Request, res: Response) => {
  const { date, freeMinutes } = req.body;
  const { userId } = req;
  try {
    const createDayRes = await createOrUpdateDay(
      +userId!,
      date,
      +freeMinutes,
      res
    );
    res.json(createDayRes);
  } catch (err) {
    console.error(err);
    throwResponseError("an error has occurred creating the day", 400, res);
  }
};

export const editDay = async (req: Request, res: Response) => {
  try {
    const { id, freeMinutes } = req.body;
    const day = await prisma.day.findUnique({
      where: {
        id: +id!,
      },
      select: {
        date: true,
        freeMins: true,
        minutesToAssign: true,
        id: true,
      },
    });
    if (!day) {
      throwResponseError("couldn't find the day you wanted to edit", 400, res);
      return;
    }
    const editedDay = await editExistingDay(day, freeMinutes);
    res.json(editedDay);
    return;
  } catch (err) {
    throwResponseError("an error has occurred editing the day", 400, res);
  }
};

export const createOrUpdateDay = async (
  userId: number,
  date: Date | string,
  freeMinutes: number,
  res: Response
) => {
  const existingDay = await prisma.day.findFirst({
    where: {
      userId: +userId!,
      date: moment(date).startOf("day").toDate(),
    },
    select: {
      freeMins: true,
      minutesToAssign: true,
      date: true,
      id: true,
    },
  });

  if (existingDay) {
    const editedDay = await editExistingDay(existingDay, freeMinutes);
    res.json(editedDay);
    return;
  }

  const day = await prisma.day.create({
    data: {
      date: moment(date).startOf("day").toDate(),
      minutesToAssign: freeMinutes,
      freeMins: freeMinutes,
      userId: +userId!,
    },
  });
  return day;
};

export const createOrUpdateDayCountingPreviousMinutes = async (
  userId: number,
  date: Date | string,
  assignedMinutes: number,
  res: Response,
  trx: Prisma.TransactionClient
) => {
  const existingDay = await trx.day.findFirst({
    where: {
      userId: userId,
      date: moment(date).startOf("day").toDate(),
    },
    select: {
      id: true,
    },
  });

  if (existingDay) {
    await decrementMinutesToAssignToExistingDay(
      existingDay.id,
      assignedMinutes,
      trx
    );
    return;
  }

  const week = await fetchWeek(userId);
  if (!week) {
    throwResponseError("could't find the week", 400, res);
    return;
  }
  const minutesInDay = findfreeMinutesInDay(moment(date).startOf("day"), week);
  if (minutesInDay - assignedMinutes < 0) {
    throwResponseError("the minutes are less than 0 somehow", 400, res);
    return;
  }
  const day = await trx.day.create({
    data: {
      date: moment(date).startOf("day").toDate(),
      freeMins: minutesInDay,
      minutesToAssign: minutesInDay - assignedMinutes,
      userId: +userId!,
    },
  });
  return day;
};

export const editExistingDay = async (
  existingDay: {
    date: Date;
    freeMins: number;
    minutesToAssign: number;
    id: number;
  },
  freeMinutes: number
) => {
  const timeRemoved = isPositiveNotZero(existingDay.freeMins - freeMinutes);
  const timeAdded = isPositiveNotZero(-(existingDay.freeMins - freeMinutes));

  if (timeRemoved) {
    if (existingDay.minutesToAssign - timeRemoved < 0) {
      throw new Error(
        "the free minutes would be less than the minutes already assigned"
      );
    }

    const editedDay = await prisma.day.update({
      data: {
        freeMins: freeMinutes,
        minutesToAssign: {
          decrement: timeRemoved,
        },
      },
      where: {
        id: existingDay.id,
        // date: moment(date).startOf('day').toDate(),
      },
    });
    return editedDay;
  }
  if (timeAdded) {
    const editedDay = await prisma.day.update({
      data: {
        freeMins: freeMinutes,
        minutesToAssign: {
          increment: timeAdded,
        },
      },
      where: {
        id: existingDay.id,
        // date: moment(date).startOf('day').toDate(),
      },
    });
    return editedDay;
  }
  console.warn("responding with nothing");

  return existingDay;
};

export const decrementMinutesToAssignToExistingDay = async (
  existingDayId: number,
  minutesAssigned: number,
  trx: Prisma.TransactionClient
) => {
  await trx.day.update({
    where: {
      id: existingDayId,
    },
    data: {
      minutesToAssign: {
        decrement: minutesAssigned,
      },
    },
  });
  return;
};
