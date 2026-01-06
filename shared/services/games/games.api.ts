import { axiosInstanse } from '../axios';
import { Game } from './games.types';

export async function getGames() {
  const response = await axiosInstanse.get<{
    games: Game[];
    count: number;
  }>('/games');
  return response.data;
}

export async function getGameById(id: number) {
  const response = await axiosInstanse.get<Game>(`/games/${id}`);
  return response.data;
}
