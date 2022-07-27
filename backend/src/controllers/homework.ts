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
  let { name, subject, duration, description, finishDate, plannedDate } =
    req.body;
  try {
    const homework = await prisma.homework.create({
      data: {
        duration,
        finishDate,
        name,
        description,
        subject,
        plannedDate,
        userId: +userId!,
      },
      select: {
        name: true,
        completed: true,
        duration: true,
        plannedDate: true,
        description: true,
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
      id: true,
      name: true,
      description: true,
      subject: true,
      finishDate: true,
      plannedDate: true,
      duration: true,
      completed: true,
    },
  });
  res.json(homework);
};
