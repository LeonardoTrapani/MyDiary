import { Request, Response, NextFunction } from 'express';
import { throwResponseError } from '../utilities';

import { prisma } from '../app';

export const createHomework = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const getHomework = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
