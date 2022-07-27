import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { prisma } from '../app';
import { CustomRequest } from '../models';
import {
  throwResponseError,
  areThereExpressValidatorErrors,
} from '../utilities';

export const signup = async (
  req: CustomRequest<{
    email: string;
    password: string;
    username: string;
  }>,
  res: Response,
  next: NextFunction
) => {
  if (areThereExpressValidatorErrors(req, res)) {
    return;
  }
  try {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 12);
    if (await mailAlreadyExists(email)) {
      throw new Error();
    }
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
        username,
      },
    });

    res.json({
      email,
      username,
    });
  } catch (err) {
    throwResponseError('Unable to signup', 400, res);
  }
};

const mailAlreadyExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    return true;
  }
  return false;
};

export const login = async (
  req: CustomRequest<{
    email: string;
    password: string;
  }>,
  res: Response
) => {
  if (areThereExpressValidatorErrors(req, res)) {
    return;
  }
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return throwResponseError('email or password are wrong', 400, res);
    }
    const passwordIsValid = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordIsValid) {
      return throwResponseError('email or password are wrong', 400, res);
    }
    const token = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_SECRET!
    );
    return res.status(200).json({
      token,
      userId: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    return throwResponseError('unable to login', 400, res);
  }
};

export const getUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: +req.userId!,
      },
      select: {
        email: true,
        username: true,
        id: true,
      },
    });
    res.json(user);
  } catch (err) {
    throwResponseError('unable to find the user', 400, res);
  }
};
