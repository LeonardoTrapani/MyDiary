import axios from 'axios';
import { BACKEND_URL } from '../constants/constants';
import { Week } from '../util/react-query-hooks';
import { getToken } from './auth';

export const createWeek = async (week: Week) => {
  const token = await getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }
  const weekRes = await axios.post(
    BACKEND_URL + '/week/create',
    {
      ...week,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return weekRes;
};
