import axios, { AxiosError } from "axios";
import {
  FreeDaysResponse,
  HomeworkInfoType,
  HomeworkPlanInfoType,
  SelectedDay,
  SingleHomeworkType,
} from "../../types";
import { BACKEND_URL, PLANNED_DATES_PER_PAGE } from "../constants/constants";
import { getDataFromAxiosError } from "../util/axiosUtils";

export const fetchFreeDays = async (
  pageNumber: number,
  homeworkInfo: HomeworkPlanInfoType,
  token: string | null | undefined
) => {
  if (!token) {
    throw "Not authenticated";
  }
  const freeDays = await axios.post<FreeDaysResponse>(
    BACKEND_URL + "/homework/freeDays/" + pageNumber,
    {
      ...homeworkInfo,
      expirationDate: new Date(homeworkInfo.expirationDate),
      daysPerPage: PLANNED_DATES_PER_PAGE,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return freeDays.data;
};

export const createHomeworkWithPlan = async (
  token: string | null | undefined,
  homeworkInfo: HomeworkPlanInfoType,
  plannedDates: SelectedDay[]
) => {
  if (!token) {
    throw "Not authenticated";
  }
  const homework = await axios.post(
    BACKEND_URL + "/homework/create",
    {
      ...homeworkInfo,
      name: homeworkInfo.title,
      expirationDate: new Date(homeworkInfo.expirationDate),
      plannedDates,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return homework;
};

export const createHomework = async (
  token: string | null | undefined,
  homeworkInfo: HomeworkInfoType
) => {
  if (!token) {
    throw "Not authenticated";
  }
  const homework = await axios.post(
    BACKEND_URL + "/homework/createWithoutPlan",
    {
      ...homeworkInfo,
      name: homeworkInfo.title,
      expirationDate: new Date(homeworkInfo.expirationDate),
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return homework;
};

export const getSingleHomework = async (
  homeworkId: number,
  token: string | null | undefined
) => {
  if (!token) {
    throw "Not authenticated";
  }
  try {
    const singleHomework = await axios.get<SingleHomeworkType>(
      BACKEND_URL + "/homework/" + homeworkId,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return singleHomework.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    throw getDataFromAxiosError(axiosError);
  }
};

export const completePlannedDate = async (
  plannedDateId: number,
  token: string | null | undefined,
  completed: boolean
) => {
  if (!token) {
    throw "Not authenticated";
  }
  try {
    if (completed === true) {
      return await axios.post(
        BACKEND_URL + "/plannedDate/complete/" + plannedDateId,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
    }
    const r = await axios.post(
      BACKEND_URL + "/plannedDate/uncomplete/" + plannedDateId,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return r.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    throw getDataFromAxiosError(axiosError);
  }
};
