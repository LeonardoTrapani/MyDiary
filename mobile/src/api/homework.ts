import axios, { AxiosError } from "axios";
import {
  FreeDaysResponse,
  HomeworkInfoType,
  SelectedDay,
  SingleHomeworkType,
} from "../../types";
import { BACKEND_URL, PLANNED_DATES_PER_PAGE } from "../constants/constants";
import { getDataFromAxiosError } from "../util/axiosUtils";

export const fetchFreeDays = async (
  pageNumber: number,
  homeworkInfo: HomeworkInfoType,
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

export const createHomework = async (
  token: string | null | undefined,
  homeworkInfo: HomeworkInfoType,
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
