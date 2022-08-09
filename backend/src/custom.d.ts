declare namespace Express {
  export interface Request {
    userId?: string;
    existingDayId?: number;
    newFreeMinutes?: number;
  }
}
