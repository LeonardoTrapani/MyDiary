import { Request, Response } from "express";
import { throwResponseError } from "../utilities";
import { prisma } from "../app";

export const completePlannedDate = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.$transaction(async (trx) => {
    const previousPlannedDate = await trx.plannedDate.findUnique({
      where: { id: +id },
      select: {
        minutesAssigned: true,
        homework: {
          select: {
            timeToComplete: true,
          },
        },
      },
    });

    if (!previousPlannedDate) {
      throwResponseError("planned date doesnt exist", 400, res);
      return;
    }

    await trx.plannedDate.update({
      where: {
        id: +id,
      },
      data: {
        completed: true,
      },
    });

    const previousMinutesAssigned = previousPlannedDate.minutesAssigned;

    await trx.homework.updateMany({
      where: {
        plannedDates: {
          some: {
            id: +id,
          },
        },
      },
      data: {
        timeToComplete: {
          decrement: previousMinutesAssigned,
        },
      },
    });

    //if all the time is completed set it to 0
    await trx.homework.updateMany({
      where: {
        plannedDates: {
          some: {
            id: +id,
          },
        },
        timeToComplete: 0,
      },
      data: {
        completed: true,
      },
    });

    if (!previousPlannedDate) {
      throwResponseError("Planned date not existing", 400, res);
      return;
    }
  });
  res.json("success");
  return;
};

export const uncompletePlannedDate = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.$transaction(async (trx) => {
    const previousPlannedDate = await trx.plannedDate.findUnique({
      where: { id: +id },
      select: {
        minutesAssigned: true,
      },
    });

    if (!previousPlannedDate) {
      throwResponseError("planned date doesnt exist", 400, res);
      return;
    }

    await trx.plannedDate.update({
      where: {
        id: +id,
      },
      data: {
        completed: false,
      },
    });

    const previousMinutesAssigned = previousPlannedDate.minutesAssigned;

    await trx.homework.updateMany({
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
          increment: previousMinutesAssigned,
        },
      },
    });

    if (!previousPlannedDate) {
      throwResponseError("Planned date not existing", 400, res);
      return;
    }
  });
  res.json("success");
  return;
};
