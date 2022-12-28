import * as SecureStore from "expo-secure-store";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../constants/constants";
import { Week } from "../util/react-query-hooks";

export const validConnection = async () => {
  try {
    await axios.get(BACKEND_URL + "/");
    return true;
  } catch (err) {
    return false;
  }
};

export const validateToken = async () => {
  const token = await getToken();
  if (token) {
    //await axios.get<boolean>(BACKEND_URL + "/validateToken", {
    //headers: {
    //Authorization: token,
    //},
    //});
    //if (res.data === false) {
    //console.warn(
    //"token was not valid, so deleting (" + res.data,
    //token + ")"
    //);
    //await SecureStore.deleteItemAsync("token");
    //}
    return token;
  } else {
    return null;
  }
};

export const getToken = async () => {
  const token = await SecureStore.getItemAsync("token");
  if (!token) {
    return null;
  }
  return "Bearer " + token;
};

export const login = async (email: string, password: string) => {
  const res = await axios.post<{
    token: string;
    weekCreated: boolean;
  }>(BACKEND_URL + "/login", {
    email,
    password,
  });

  try {
    await SecureStore.setItemAsync("token", res.data.token);
    await SecureStore.setItemAsync(
      "weekCreated",
      JSON.stringify(res.data.weekCreated)
    );
  } catch (error) {
    throw new Error("Couldn't login");
  }
  return;
};

export const signup = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await axios.post(BACKEND_URL + "/signup", {
    email,
    username,
    password,
  });

  try {
    await SecureStore.setItemAsync("token", res.data.token);
    await SecureStore.setItemAsync("weekCreated", JSON.stringify(false));
  } catch (error) {
    throw new Error("Couldn't login");
  }
  return res;
};

export const getWeek = async () => {
  const token = await getToken();
  if (!token) {
    throw new Error("Cannot find token");
  }
  const res = await axios.get<Week>(BACKEND_URL + "/week/get", {
    headers: {
      Authentication: token,
    },
  });
  return res.data;
};

export const getWeekWithToken = async (token: string) => {
  const res = await axios.get<{ week: Week }>(BACKEND_URL + "/week/get", {
    headers: {
      Authorization: token,
    },
  });
  return res.data.week;
};

export const getIsWeekCreated = async () => {
  const res = await SecureStore.getItemAsync("weekCreated");
  if (!res) {
    return false;
  }
  const weekCreated = JSON.parse(res);
  if (typeof weekCreated !== "boolean") {
    console.warn(weekCreated, " is not a boolean, deleting everything");
    await SecureStore.deleteItemAsync("weekCreated");
    return false;
  }
  return weekCreated;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getIsWeekCreatedWithToken = async ({
  queryKey,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  try {
    const token = queryKey[1];
    const res = await SecureStore.getItemAsync("weekCreated");
    let weekCreated;
    !res ? (weekCreated = false) : (weekCreated = JSON.parse(res));
    if (weekCreated === false && token) {
      const week = await getWeekWithToken(token);

      if (week) {
        return true;
      }
      return false;
    }
    return weekCreated;
  } catch (err) {
    const error = err as AxiosError;
    console.warn(error.response?.data);
    return false;
  }
};
export const logout = async () => {
  await SecureStore.deleteItemAsync("weekCreated");
  await SecureStore.deleteItemAsync("token");
};
