import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
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

export const plannedDatesAreValid = (
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
  if (totalMinutes < req.body.duration) {
    throwResponseError(
      "The duration provided don't complete your duration limit",
      400,
      res
    );
    return;
  }
  next();
};
