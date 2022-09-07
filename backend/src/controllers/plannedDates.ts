import { Request, Response } from "express";
import { throwResponseError } from "../utilities";
import { prisma } from "../app";

export const completePlannedDate = async (req: Request, res: Response) => {
  const { id } = req.params;

  const plannedDateUpdated = await prisma.plannedDate.update({
    where: {
      id: +id,
    },
    data: {
      completed: true,
    },
  });
  if (!plannedDateUpdated.minutesAssigned) {
    throwResponseError("Planned date not existing", 400, res);
    return;
  }

  await prisma.homework.updateMany({
    where: {
      plannedDates: {
        some: {
          id: +id,
        },
        every: {
          completed: true,
        },
      },
    },
    data: {
      completed: true,
      timeToComplete: {
        decrement: plannedDateUpdated.minutesAssigned,
      },
    },
  });

  res.json(plannedDateUpdated);
  return;
};

export const uncompletePlannedDate = async (req: Request, res: Response) => {
  const { id } = req.params;

  const newPlannedDate = await prisma.plannedDate.update({
    where: {
      id: +id,
    },
    data: {
      completed: false,
    },
  });

  await prisma.homework.updateMany({
    where: {
      plannedDates: {
        some: {
          id: +id,
        },
      },
    },
    data: {
      completed: false,
      timeToComplete: {
        increment: newPlannedDate.minutesAssigned,
      },
    },
  });

  if (!newPlannedDate) {
    throwResponseError("Planned date not existing", 400, res);
    return;
  }
  res.json(newPlannedDate);
  return;
};
