import { Request } from 'express';

export interface ErrorResponse {
  statusCode: number;
  message: string;
}

export interface CustomRequest<T> extends Request {
  body: T;
}
