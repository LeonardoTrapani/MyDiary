import { NextFunction, Request, Response } from 'express';
import { prisma } from '../app';
import {
  areThereExpressValidatorErrors,
  throwResponseError,
} from '../utilities';
export const createWeek = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    mondayHours,
    tuesdayHours,
    wednesdayHours,
    thursdayHours,
    fridayHours,
    saturdayHours,
    sundayHours,
  } = req.body;
  const userId = +req.userId!;
  if (areThereExpressValidatorErrors(req, res)) {
    return;
  }
  try {
    const weekExistance = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        week: true,
      },
    });
    if (weekExistance?.week) {
      return throwResponseError(
        'An error has occurred: the week has already been created',
        400,
        res
      );
    }
    const week = await prisma.week.create({
      data: {
        mondayHours,
        tuesdayHours,
        wednesdayHours,
        thursdayHours,
        fridayHours,
        saturdayHours,
        sundayHours,
        userId,
      },
      select: {
        mondayHours: true,
        tuesdayHours: true,
        wednesdayHours: true,
        thursdayHours: true,
        fridayHours: true,
        saturdayHours: true,
        sundayHours: true,
      },
    });
    return res.json(week);
  } catch (err) {
    return throwResponseError(
      'an error has occurred creating the week',
      400,
      res
    );
  }
};
