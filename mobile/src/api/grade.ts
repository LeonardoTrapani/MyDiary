import axios from "axios";
import { AllGrades } from "../../types";
import { BACKEND_URL } from "../constants/constants";
import { getDataFromAxiosError } from "../util/axiosUtils";

export const getAllGrades = async (token: string | null | undefined) => {
  if (!token) {
    throw new Error("Not authenticated");
  }
  try {
    const res = await axios.get<AllGrades>(BACKEND_URL + "/grade/all", {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (err) {
    const errMessage = getDataFromAxiosError(err, "an error has occurred");
    throw new Error(errMessage);
  }
};
