import { useQuery } from '@tanstack/react-query';
import { getToken, validateToken } from '../api/auth';

export const useGetToken = () =>
  useQuery<string | null>(['token'], getToken, {
    refetchOnMount: false,
  });

export const useIsTokenValid = () => {
  const { data: token } = useQuery<string | null>(['token'], getToken, {
    refetchOnMount: false,
  });
  return useQuery<boolean>(['isTokenValid', token], validateToken, {
    refetchOnMount: false,
    enabled: typeof token !== 'undefined',
  });
};
