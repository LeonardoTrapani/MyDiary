import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { BACKEND_URL } from '../constants/constants';
import { QueryFunctionContext } from '@tanstack/react-query';

export const validateToken = async ({
  queryKey,
}: QueryFunctionContext<[string, string | null | undefined]>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, token] = queryKey;
  if (token) {
    const res = await axios.get<boolean>(BACKEND_URL + '/', {
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  } else {
    return false;
  }
};

export const getToken = async () => {
  console.log('getting token');
  return await SecureStore.getItemAsync('token');
};
