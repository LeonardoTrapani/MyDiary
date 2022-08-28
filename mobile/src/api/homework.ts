import axios from "axios";
import { FreeDaysResponse, HomeworkInfoType } from "../../types";
import { BACKEND_URL, PLANNED_DATES_PER_PAGE } from "../constants/constants";

export const fetchFreeDays = async (
  pageNumber: number,
  homeworkInfo: HomeworkInfoType,
  token: string | null | undefined
) => {
  if (!token) {
    console.log("GONNA THROw");
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
  console.log("PIANO C");
  console.log({ freeDays });
  return freeDays.data;
};
