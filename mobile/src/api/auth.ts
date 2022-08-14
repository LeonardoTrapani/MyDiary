import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { BACKEND_URL } from '../constants/constants';

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
  }>(BACKEND_URL + '/login', {
    email,
    password,
  });
  await SecureStore.setItemAsync('token', res.data.token);
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
