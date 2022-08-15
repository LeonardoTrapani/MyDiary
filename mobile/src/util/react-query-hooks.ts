import { useQuery } from '@tanstack/react-query';
import {
  getIsWeekCreated,
  getToken,
  getWeek,
  validateToken,
} from '../api/auth';

export const useGetToken = () => useQuery<string | null>(['token'], getToken);

export const useIsTokenValid = () => {
  return useQuery<boolean>(['isTokenValid'], validateToken);
};

export const useIsWeekCreated = () => {
  return useQuery<boolean>(['isWeekCreated'], getIsWeekCreated);
};

export type Week = {
  id: number;
  mondayFreeMinutes: number;
  tuesdayFreeMinutes: number;
  wednesdayFreeMinutes: number;
  thursdayFreeMinutes: number;
  fridayFreeMinutes: number;
  saturdayFreeMinutes: number;
  sundayFreeMinutes: number;
};

export const useWeek = () => {
  return useQuery<Week | null>(['week'], getWeek);
};
