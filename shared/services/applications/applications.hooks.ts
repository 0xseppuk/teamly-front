import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createApplication,
  deleteApplication,
  getAllApplications,
  getApplicationById,
  getUserApplications,
  updateApplication,
} from './applications.api';
import { CreateApplicationDTO } from './applications.types';

export const useGetUserApplications = () => {
  return useQuery({
    queryKey: ['applications', 'my'],
    queryFn: getUserApplications,
  });
};

export const useGetAllApplications = (params?: {
  game_id?: string;
  platform?: string;
  with_voice_chat?: boolean;
}) => {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => getAllApplications(params),
    staleTime: 30000, // 30 секунд - данные считаются свежими
    gcTime: 300000, // 5 минут - время хранения в кеше
  });
};

export const useGetApplicationById = (id: string) => {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => getApplicationById(id),
    enabled: !!id,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationDTO) => createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateApplicationDTO }) =>
      updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};
