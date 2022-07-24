import { NextFunction, Request, Response } from 'express';
import { prisma } from 'src/app';

export const createWeek = (req: Request, res: Response, next: NextFunction) => {
  const {
    mondayHours,
    tuesdayHours,
    wednesdayHours,
    thursdayHours,
    fridayHours,
    saturdayHours,
    sundayHours,
  } = req.body;
  console.log(mondayHours);
};
