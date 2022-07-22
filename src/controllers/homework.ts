import { Request, Response, NextFunction } from 'express';
import {
  areThereExpressValidatorErrors,
  throwResponseError,
} from '../utilities';

import { prisma } from '../app';

export const createHomework = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (areThereExpressValidatorErrors(req, res)) {
    return;
  }
  const { userId } = req;
  let { name, subject, finishDate, plannedDate, duration } = req.body;
  finishDate = new Date();
  plannedDate = new Date();
  try {
    const homework = await prisma.homework.create({
      data: {
        userId: +userId!, //TODO: validate and remove excalmation mark
        duration,
        finishDate,
        name,
        subject,
        plannedDate,
      },
      select: {
        name: true,
        completed: true,
        duration: true,
        finishDate: true,
        subject: true,
      },
    });
    res.json(homework);
  } catch (err) {
    throwResponseError('unable to create homework', 500, res);
  }
};

export const getAllHomework = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = +req.userId!;
  const homework = await prisma.homework.findMany({
    where: {
      userId,
    },
    select: {
      name: true,
      subject: true,
      finishDate: true,
      plannedDate: true,
      duration: true,
      completed: true,
    },
  });
  res.json(homework);
};
