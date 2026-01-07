import { useQuery } from '@tanstack/react-query';

import { getUserById } from './users.api';

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
