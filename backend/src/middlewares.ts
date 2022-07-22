import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { throwResponseError } from './utilities';

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
    const token = req.get('Authorization')?.split(' ')[1];
    if (!token) {
      throw new Error();
    }
    token.split(' ')[1];
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
    throwResponseError('Not authenticated', 401, res);
  }
};
