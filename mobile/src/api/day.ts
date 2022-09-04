import axios from "axios";
import { BACKEND_URL } from "../constants/constants";
import { getDataFromAxiosError } from "../util/axiosUtils";

export const editDay = async (
  date: string,
  freeMinutes: number,
  token: string | null | undefined
) => {
  if (!token) {
    throw "Not Authenticated";
  }
  try {
    const res = await axios.post(
      BACKEND_URL + "/day/create",
      {
        date,
        freeMinutes,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw getDataFromAxiosError(err);
  }
};
