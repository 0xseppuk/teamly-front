import { useQuery } from '@tanstack/react-query';

import { getGameById, getGames } from './games.api';

export const useGetGames = () => {
  return useQuery({
    queryKey: ['games'],
    queryFn: getGames,
    staleTime: 60000, // 1 минута - игры редко меняются
    gcTime: 600000, // 10 минут - время хранения в кеше
  });
};

export const useGetGameById = (id: number) => {
  return useQuery({
    queryKey: ['game', id],
    queryFn: () => getGameById(id),
  });
};
