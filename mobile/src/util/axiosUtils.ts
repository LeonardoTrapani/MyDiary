import { AxiosError } from 'axios';
import { useCallback } from 'react';

export const useGetDataFromAxiosError = (
  err: AxiosError,
  defaultMessage: string | undefined = 'an error has occurred'
) =>
  useCallback(() => {
    if (!err) {
      return null;
    }
    if (!err.response) {
      return defaultMessage;
    }
    const data = err.response.data as {
      message: string;
      statusCode: number;
    };
    if (data) {
      return data.message;
    }
    return defaultMessage;
  }, [err, defaultMessage]);
