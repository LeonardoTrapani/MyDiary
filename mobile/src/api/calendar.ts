import axios from "axios";
import { CalendarDayType } from "../../types";
import { BACKEND_URL } from "../constants/constants";
import { getDataFromAxiosError } from "../util/axiosUtils";

export const getDayCalendar = async (
  page: number,
  token: string | null | undefined
) => {
  if (!token) {
    throw new Error("Not authenticated");
  }
  try {
    const res = await axios.get<CalendarDayType>(
      BACKEND_URL + "/calendar/day/" + page,
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (err) {
    const errMessage = getDataFromAxiosError(err, "an error has occurred");
    throw new Error(errMessage);
  }
};
