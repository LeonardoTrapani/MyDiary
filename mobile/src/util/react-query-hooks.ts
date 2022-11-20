import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Moment } from "moment";
import {
  AllGrades,
  PlannedCalendarDayType,
  FreeDaysResponse,
  HomeworkPlanInfoType,
  SingleHomeworkType,
  DueCalendarDayType,
} from "../../types";
import {
  getIsWeekCreatedWithToken,
  getWeek,
  validateToken,
  validConnection,
} from "../api/auth";
import { getDueCalendarDay, getPlannedCalnedarDay } from "../api/calendar";
import { getAllGrades } from "../api/grade";
import { fetchFreeDays, getSingleHomework } from "../api/homework";
import { getSubjects } from "../api/subject";

export const useValidConnection = () => {
  return useQuery<boolean | undefined>(["validConnection"], validConnection);
};

export const useValidToken = () => {
  return useQuery<string | null>(["validToken"], validateToken);
};

export const useIsWeekCreated = () => {
  const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();
  return useQuery<boolean>(
    ["isWeekCreated", validToken],
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
  return useQuery<Week | null>(["week"], getWeek, {});
};

export type SubjectType = {
  id: number;
  color: string;
  name: string;
};

export const useSubjects = () => {
  const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();
  return useQuery<SubjectType[]>(["subject", validToken], getSubjects, {
    enabled: isValidTokenFetched,
  });
};

export const useFreeDays = (homeworkInfo: HomeworkPlanInfoType) => {
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
  return infQuery;
};

export const usePlannedCalendarDay = (date: Moment) => {
  const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();
  return useQuery<PlannedCalendarDayType>(
    ["plannedCalendarDay", date],
    () => getPlannedCalnedarDay(date, validToken),
    {
      enabled: isValidTokenFetched,
      keepPreviousData: true,
    }
  );
};

export const useDueCalendarDay = (date: Moment) => {
  const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();
  return useQuery<DueCalendarDayType>(
    ["dueCalendarDay", date],
    () => getDueCalendarDay(date, validToken),
    {
      enabled: isValidTokenFetched,
      keepPreviousData: true,
    }
  );
};

export const useSingleHomework = (homeworkId: number) => {
  const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();
  return useQuery<SingleHomeworkType>(
    ["singleHomework", homeworkId],
    () => getSingleHomework(homeworkId, validToken),
    {
      enabled: isValidTokenFetched,
    }
  );
};

export const useAllGrades = () => {
  const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();
  return useQuery<AllGrades>(["allGrades"], () => getAllGrades(validToken), {
    enabled: isValidTokenFetched,
  });
};
