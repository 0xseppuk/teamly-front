import type {
  CreateResponseDTO,
  UpdateResponseStatusDTO,
} from './responses.types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createApplicationResponse,
  getApplicationResponses,
  getMyResponses,
  updateResponseStatus,
} from './responses.api';

// Создать отклик
export const useCreateApplicationResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: CreateResponseDTO;
    }) => createApplicationResponse(applicationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['application-responses', variables.applicationId],
      });
      queryClient.invalidateQueries({
        queryKey: ['my-responses'],
      });
      queryClient.invalidateQueries({
        queryKey: ['applications'],
      });
    },
  });
};

// Получить мои отклики
export const useGetMyResponses = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['my-responses'],
    queryFn: getMyResponses,
    enabled, // Отключаем если не авторизован
    staleTime: 30000,
    retry: false, // Не пытаться повторно при 401
  });
};

// Получить отклики на заявку
export const useGetApplicationResponses = (applicationId: string) => {
  return useQuery({
    queryKey: ['application-responses', applicationId],
    queryFn: () => getApplicationResponses(applicationId),
    enabled: !!applicationId,
    staleTime: 30000,
  });
};

// Принять/отклонить отклик
export const useUpdateResponseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      responseId,
      data,
    }: {
      responseId: string;
      data: UpdateResponseStatusDTO;
    }) => updateResponseStatus(responseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['application-responses'],
      });
      queryClient.invalidateQueries({
        queryKey: ['my-responses'],
      });
    },
  });
};
