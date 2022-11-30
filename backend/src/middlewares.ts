import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { prisma } from "./app";
import { throwResponseError } from "./utilities";

type JwtPayload =
  | {
      userId: string;
    }
  | undefined;

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!token) {
      throw new Error();
    }
    token.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    if (!decodedToken) {
      throw new Error();
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    throwResponseError("Not authenticated", 401, res);
  }
};

export const validateExpressValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    throwResponseError(message, 400, res);
    return;
  }
  next();
};

export const createHomeworkPlannedDatesAreValid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const plannedDates = req.body.plannedDates as {
    date: string;
    minutes: number;
  }[];
  const totalMinutes = plannedDates.reduce((prev, curr) => {
    return prev + curr.minutes;
  }, 0);
  if (totalMinutes > req.body.duration) {
    throwResponseError(
      "The duration provided exceed your duration limit",
      400,
      res
    );
    return;
  }
  next();
};

export const planHomeworkPlannedDatesAreValid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { homeworkId } = req.body;
  const plannedDates = req.body.plannedDates as {
    date: string;
    minutes: number;
  }[];
  try {
    const totalMinutes = plannedDates.reduce((prev, curr) => {
      return prev + curr.minutes;
    }, 0);

    for (let i = 0; i < plannedDates.length; i++) {
      const currDay = await prisma.day.findFirst({
        where: {
          userId: +userId!,
          date: plannedDates[i].date,
        },
      });
      const prevPlannedDate = await prisma.plannedDate.findFirst({
        where: {
          date: plannedDates[i].date,
          homework: {
            userId: +userId!,
            id: homeworkId,
          },
        },
      });
      if (!currDay) {
        continue;
      }
      if (
        currDay.minutesToAssign + (prevPlannedDate?.minutesAssigned || 0) <
        plannedDates[i].minutes
      ) {
        console.log(currDay, plannedDates[i]);
        throw "The minutes in the days are not enough";
      }
    }
    if (totalMinutes > req.body.duration) {
      throw "The duration provided exceed your duration limit";
    }
    next();
  } catch (err) {
    throwResponseError(err as string, 400, res);
  }
};
