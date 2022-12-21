import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { prisma } from "../app";
import { CustomRequest } from "../models";
import { throwResponseError } from "../utilities";
import { fetchWeek } from "./week";

export const signup = async (
  req: CustomRequest<{
    email: string;
    password: string;
    username: string;
  }>,
  res: Response
) => {
  try {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 12);
    if (await mailAlreadyExists(email)) {
      console.log("1");
      throwResponseError("This email is already in use", 400, res);
      return;
    }
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        username,
      },
    });

    const token = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_SECRET!
    );

    res.json({
      email,
      token,
      username,
    });
  } catch (err) {
    console.warn(err);
    throwResponseError("Unable to signup", 400, res);
  }
};

const mailAlreadyExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findFirst({
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
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
        deleted: false,
      },
    });

    if (!user) {
      return throwResponseError("email or password are wrong", 400, res);
    }
    const passwordIsValid = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordIsValid) {
      return throwResponseError("email or password are wrong", 400, res);
    }
    const token = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_SECRET!
    );
    const week = await fetchWeek(user.id);
    return res.status(200).json({
      token,
      weekCreated: !!week,
    });
  } catch (err) {
    console.error(err);
    return throwResponseError("unable to login", 400, res);
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: +req.userId!,
        deleted: false,
      },
      select: {
        email: true,
        username: true,
        id: true,
      },
    });
    res.json(user);
  } catch (err) {
    throwResponseError("unable to find the user", 400, res);
  }
};

export const validateToken = async (req: Request, res: Response) => {
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
    if (decodedToken) {
      const user = await prisma.user.findFirst({
        where: {
          id: decodedToken.userId,
        },
      });
      res.json(!!user);
    } else {
      res.json(false);
    }
  } catch (err) {
    res.json(false);
  }
};
