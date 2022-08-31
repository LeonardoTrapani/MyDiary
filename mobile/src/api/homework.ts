import axios from "axios";
import { FreeDaysResponse, HomeworkInfoType, SelectedDay } from "../../types";
import { BACKEND_URL, PLANNED_DATES_PER_PAGE } from "../constants/constants";

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
