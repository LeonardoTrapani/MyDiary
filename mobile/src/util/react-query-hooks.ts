import {
  GetNextPageParamFunction,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { FreeDays, HomeworkInfoType } from "../../types";
import { getIsWeekCreatedWithToken, getWeek, validateToken } from "../api/auth";
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
  return useQuery<Week | null>(["week"], getWeek);
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
  });
};

export const useFreeDays = (homeworkInfo: HomeworkInfoType) => {
  const { data: validToken, isFetched: isValidTokenFetched } = useValidToken();
  return useInfiniteQuery<FreeDays>(
    ["freeDays"],
    ({ pageParam = 1 }) => fetchFreeDays(pageParam, homeworkInfo, validToken),
    {
      enabled: isValidTokenFetched,
      getNextPageParam: (lastPage) => lastPage.days ?? undefined,
    }
  );
};
