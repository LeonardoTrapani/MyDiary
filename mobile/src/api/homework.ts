import axios from "axios";
import { FreeDays, HomeworkInfoType } from "../../types";
import { BACKEND_URL } from "../constants/constants";

export const fetchFreeDays = async (
  homeworkInfo: HomeworkInfoType,
  pageNumber: number,
  token: string | null | undefined
) => {
  if (!token) {
    throw "Not authenticated";
  }
  const freeDays = await axios.post<FreeDays>(
    BACKEND_URL + "/homework/freeDays/" + pageNumber,
    { ...homeworkInfo, expirationDate: new Date(homeworkInfo.expirationDate) },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return freeDays.data;
};
