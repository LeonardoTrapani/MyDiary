import axios from "axios";
import { BACKEND_URL } from "../constants/constants";
import { Subject } from "../util/react-query-hooks";

export const getSubjects = async ({
  queryKey,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  const token = queryKey[1];
  if (!token) {
    throw new Error("Not authenticated");
  }
  const res = await axios.get<Subject[]>(BACKEND_URL + "/subject/all", {
    headers: {
      Authorization: token,
    },
  });
  return res.data;
};
