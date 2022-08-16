import { useQuery } from '@tanstack/react-query';
import { getIsWeekCreatedWithToken, getWeek, validateToken } from '../api/auth';

export const useValidToken = () => {
  return useQuery<string | null>(['validToken'], validateToken);
};

// export const useIsWeekCreated = () => {
//   return useQuery<boolean>(['isWeekCreated'], getIsWeekCreated);
// };

export const useIsWeekCreated = () => {
  const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();
  return useQuery<boolean>(
    ['isWeekCreated', validToken],
    getIsWeekCreatedWithToken,
    {
      enabled: isValidTokenFetched,
    }
  );
};

export type Week = {
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
