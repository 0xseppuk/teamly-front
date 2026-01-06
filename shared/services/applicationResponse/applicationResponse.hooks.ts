import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createApplicationResponse,
  getApplicationResponses,
  getMyResponses,
  updateResponseStatus,
} from './applicationResponse.api';
import {
  CreateResponseDTO,
  UpdateResponseStatusDTO,
} from './applicationsResponse.types';

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

export const useGetMyResponses = () => {
  return useQuery({
    queryKey: ['my-responses'],
    queryFn: getMyResponses,
    staleTime: 30000,
  });
};

export const useGetApplicationResponses = (applicationId: string) => {
  return useQuery({
    queryKey: ['application-responses', applicationId],
    queryFn: () => getApplicationResponses(applicationId),
    enabled: !!applicationId,
    staleTime: 30000,
  });
};

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
