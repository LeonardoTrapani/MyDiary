import { ErrorResponse } from './models';
import { Response, Request } from 'express';
import { validationResult } from 'express-validator';

export const throwResponseError = (
  message: string,
  statusCode: number,
  res: Response
) => {
  const response: ErrorResponse = {
    message: message,
    statusCode: statusCode,
  };
  return res.status(response.statusCode).json(response);
};

export const areThereExpressValidatorErrors = (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    throwResponseError(message, 400, res);
    return true;
  }
  return false;
};
