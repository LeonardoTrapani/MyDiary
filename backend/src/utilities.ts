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

// export const validatorDateHandler = (date: any) => {
//   return dateIsValid(date) && dateLessThanDays(365, new Date(date));
// };

export const addDaysFromToday = (daysToAdd: number) => {
  return addDays(new Date(Date.now()), daysToAdd);
};

export const addDays = (from: Date, daysToAdd: number) => {
  let result = new Date(from);
  result.setDate(result.getDate() + daysToAdd);
  return result;
};

export const dateLessThanDays = (days: number, date: Date) => {
  return date <= addDaysFromToday(days);
};

export const isValidDate = (str: string) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  var d = new Date(str);
  return d.toISOString() === str;
};
