import { useQuery } from '@tanstack/react-query';
import { getToken, validateToken } from '../api/auth';

export const useGetToken = () =>
  useQuery<string | null>(['token'], getToken, {
    refetchOnMount: false,
  });

export const useIsTokenValid = () => {
  return useQuery<boolean>(['isTokenValid'], validateToken, {
    refetchOnMount: false,
  });
};
