import { Request, Response } from "express";
import { throwResponseError } from "../utilities";
import { prisma } from "../app";

export const completePlannedDate = async (req: Request, res: Response) => {
  const { id } = req.params;

  const r = await prisma.plannedDate.update({
    where: {
      id: +id,
    },
    data: {
      completed: true,
    },
  });
  if (!r) {
    throwResponseError("Planned date not existing", 400, res);
    return;
  }
  res.json(r);
  return;
};

export const uncompletePlannedDate = async (req: Request, res: Response) => {
  const { id } = req.params;

  const r = await prisma.plannedDate.update({
    where: {
      id: +id,
    },
    data: {
      completed: false,
    },
  });
  if (!r) {
    throwResponseError("Planned date not existing", 400, res);
    return;
  }
  res.json(r);
  return;
};
