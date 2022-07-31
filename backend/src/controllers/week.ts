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
    mondayFreeMinutes,
    tuesdayFreeMinutes,
    wednesdayFreeMinutes,
    thursdayFreeMinutes,
    fridayFreeMinutes,
    saturdayFreeMinutes,
    sundayFreeMinutes,
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
        mondayFreeMinutes,
        tuesdayFreeMinutes,
        wednesdayFreeMinutes,
        thursdayFreeMinutes,
        fridayFreeMinutes,
        saturdayFreeMinutes,
        sundayFreeMinutes,
        userId,
      },
      select: {
        mondayFreeMinutes: true,
        tuesdayFreeMinutes: true,
        wednesdayFreeMinutes: true,
        thursdayFreeMinutes: true,
        fridayFreeMinutes: true,
        saturdayFreeMinutes: true,
        sundayFreeMinutes: true,
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

export const getWeek = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const week = await prisma.user.findUnique({
    where: {
      id: +userId!,
    },
    select: {
      week: {
        select: {
          mondayFreeMinutes: true,
          tuesdayFreeMinutes: true,
          wednesdayFreeMinutes: true,
          thursdayFreeMinutes: true,
          fridayFreeMinutes: true,
          saturdayFreeMinutes: true,
          sundayFreeMinutes: true,
        },
      },
    },
  });
  res.json(week);
};
