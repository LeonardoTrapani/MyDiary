import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Moment } from "moment";
import {
  CalendarDayType,
  FreeDaysResponse,
  HomeworkInfoType,
} from "../../types";
import { getIsWeekCreatedWithToken, getWeek, validateToken } from "../api/auth";
import { getDayCalendar } from "../api/calendar";
import { fetchFreeDays } from "../api/homework";
import { getSubjects } from "../api/subject";

export const useValidToken = () => {
  return useQuery<string | null>(["validToken"], validateToken);
};

export const useIsWeekCreated = () => {
  const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();
  return useQuery<boolean>(
    ["isWeekCreated", validToken],
    getIsWeekCreatedWithToken,
    {
      refetchOnMount: true,
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
  return useQuery<Week | null>(["week"], getWeek, { refetchOnMount: true });
};

export type Subject = {
  id: number;
  color: string;
  name: string;
};

export const useSubjects = () => {
  const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();
  return useQuery<Subject[]>(["subject", validToken], getSubjects, {
    enabled: isValidTokenFetched,
    refetchOnMount: true,
  });
};

export const useFreeDays = (homeworkInfo: HomeworkInfoType) => {
  const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();
  const infQuery = useInfiniteQuery<FreeDaysResponse>(
    ["freeDays"],
    ({ pageParam = 1 }) => fetchFreeDays(pageParam, homeworkInfo, validToken),
    {
      enabled: isValidTokenFetched,
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor;
      },
    }
  );
  console.log(infQuery.isFetching);
  return infQuery;
};

export const useCalendarDay = (date: Moment) => {
  const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();
  return useQuery<CalendarDayType>(
    ["calendarDay", date],
    () => getDayCalendar(date, validToken),
    {
      enabled: isValidTokenFetched,
      refetchOnMount: true,
      keepPreviousData: true,
    }
  );
};
