import { useQuery } from '@tanstack/react-query';
import { getToken, validateToken } from '../api/auth';

export const useGetToken = () =>
  useQuery<string | null>(['token'], getToken, {
    refetchOnMount: false,
  });

export const useUserId = () => {
  const { data: token } = useQuery<string | null>(['token'], getToken, {
    refetchOnMount: false,
  });
  return useQuery<number | null>(['userId', token], validateToken, {
    refetchOnMount: false,
    enabled: typeof token === 'string' || token === null,
  });
};
