import axios, { AxiosError } from "axios";
import { Moment } from "moment";
import { DueCalendarDayType, PlannedCalendarDayType } from "../../types";
import { BACKEND_URL } from "../constants/constants";
import { getDataFromAxiosError } from "../util/axiosUtils";

export const getPlannedCalnedarDay = async (
  date: Moment,
  token: string | null | undefined
) => {
  if (!token) {
    throw new Error("Not authenticated");
  }
  try {
    const res = await axios.get<PlannedCalendarDayType>(
      BACKEND_URL + "/calendar/planned/" + date.toISOString(),
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (err) {
    const errMessage = getDataFromAxiosError(
      err as AxiosError,
      "an error has occurred"
    );
    throw new Error(errMessage);
  }
};

export const getDueCalendarDay = async (
  date: Moment,
  token: string | null | undefined
) => {
  if (!token) {
    throw new Error("Not authenticated");
  }
  try {
    const res = await axios.get<DueCalendarDayType>(
      BACKEND_URL + "/calendar/due/" + date.toISOString(),
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (err) {
    const errMessage = getDataFromAxiosError(
      err as AxiosError,
      "an error has occurred"
    );
    throw new Error(errMessage);
  }
};
