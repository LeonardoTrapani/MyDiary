import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { BACKEND_URL } from '../constants/constants';
import { Week } from '../util/react-query-hooks';

export const validateToken = async () => {
  const token = await getToken();

  if (token) {
    const res = await axios.get<boolean>(BACKEND_URL + '/validateToken', {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });

    if (res.data === false) {
      await SecureStore.deleteItemAsync('token');
    }
    return res.data;
  } else {
    return false;
  }
};

export const getToken = async () => {
  return await SecureStore.getItemAsync('token');
};

export const login = async (email: string, password: string) => {
  const res = await axios.post<{
    token: string;
    weekCreated: boolean;
  }>(BACKEND_URL + '/login', {
    email,
    password,
  });

  try {
    await SecureStore.setItemAsync('token', res.data.token);
    await SecureStore.setItemAsync(
      'weekCreated',
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
  const res = await axios.post(BACKEND_URL + '/signup', {
    email,
    username,
    password,
  });
  return res;
};

export const getWeek = async () => {
  const token = await getToken();
  if (!token) {
    throw new Error('Cannot find token');
  }
  const res = await axios.get<Week>(BACKEND_URL + '/week/get', {
    headers: {
      Authentication: token,
    },
  });
  return res.data;
};

export const getIsWeekCreated = async () => {
  const res = await SecureStore.getItemAsync('weekCreated');
  if (!res) {
    return false;
  }
  const weekCreated = JSON.parse(res);
  if (typeof weekCreated !== 'boolean') {
    await SecureStore.deleteItemAsync('weekCreated');
    return false;
  }
  return weekCreated;
};

export const logout = async () => {
  await SecureStore.deleteItemAsync('weekCreated');
  await SecureStore.deleteItemAsync('token');
};
