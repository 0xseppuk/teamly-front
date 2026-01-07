import { axiosInstanse } from '../axios';

import {
  ApplicationResponse,
  ApplicationResponseWithMessage,
  CreateResponseDTO,
  UpdateResponseStatusDTO,
} from './applicationsResponse.types';

export async function createApplicationResponse(
  applicationId: string,
  data: CreateResponseDTO,
) {
  const response = await axiosInstanse.post<ApplicationResponse>(
    `/applications/${applicationId}/responses`,
    data,
  );

  return response.data;
}

export async function getApplicationResponses(applicationId: string) {
  const response = await axiosInstanse.get<ApplicationResponseWithMessage[]>(
    `/applications/${applicationId}/responses`,
  );

  return response.data;
}

export async function getMyResponses() {
  const responses =
    await axiosInstanse.get<ApplicationResponse[]>('/responses/my');

  return responses.data;
}

export async function updateResponseStatus(
  responseId: string,
  data: UpdateResponseStatusDTO,
) {
  const response = await axiosInstanse.patch<ApplicationResponse>(
    `/responses/${responseId}`,
    data,
  );

  return response.data;
}
