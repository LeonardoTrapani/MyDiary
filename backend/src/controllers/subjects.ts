import { NextFunction, Request, Response } from 'express';
import { throwResponseError } from '../utilities';
import { prisma } from '../app';

export const getAllSubjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  try {
    const subjects = await prisma.subject.findMany({
      where: {
        userId: +userId!,
      },
      select: {
        color: true,
        id: true,
        name: true,
      },
    });
    res.json(subjects);
  } catch {
    throwResponseError('unable to fetch subjects', 400, res);
  }
};

export const createSubject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { name, color } = req.body;
  try {
    const subject = await prisma.subject.create({
      data: {
        userId: +userId!,
        name: name,
        color: color,
      },
      select: {
        color: true,
        name: true,
        id: true,
      },
    });
    res.json(subject);
  } catch {
    throwResponseError("couldn't create subject", 400, res);
  }
};
