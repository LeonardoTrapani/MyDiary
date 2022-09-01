import axios from "axios";
import { Moment } from "moment";
import { CalendarDayType } from "../../types";
import { BACKEND_URL } from "../constants/constants";
import { getDataFromAxiosError } from "../util/axiosUtils";

export const getDayCalendar = async (
  date: Moment,
  token: string | null | undefined
) => {
  console.log("FETCHING");
  if (!token) {
    throw new Error("Not authenticated");
  }
  try {
    const res = await axios.get<CalendarDayType>(
      BACKEND_URL + "/calendar/day/" + date.toISOString(),
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (err) {
    const errMessage = getDataFromAxiosError(err, "an error has occurred");
    throw new Error(errMessage);
  }
};
