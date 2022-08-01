import { ErrorResponse } from './models';
import { Response } from 'express';

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

export const validatorDateHandler = (value: any) => {
  return dateIsValid(new Date(value));
};

function dateIsValid(date: any) {
  return (
    Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date)
  );
}
