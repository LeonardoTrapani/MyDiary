import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { BACKEND_URL } from '../constants/constants';

export const validateToken = async ({ queryKey }: any) => {
  console.log('validating token');
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
