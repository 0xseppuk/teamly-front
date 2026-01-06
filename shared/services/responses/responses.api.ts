import { axiosInstanse } from '../axios';
import type {
  ApplicationResponse,
  CreateResponseDTO,
  UpdateResponseStatusDTO,
  ApplicationResponseWithMessage,
} from './responses.types';

// Создать отклик на заявку
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

// Получить отклики на мою заявку (только для автора)
export async function getApplicationResponses(applicationId: string) {
  const response = await axiosInstanse.get<ApplicationResponseWithMessage[]>(
    `/applications/${applicationId}/responses`,
  );
  return response.data;
}

// Получить мои отклики (куда я откликнулся)
export async function getMyResponses() {
  const response = await axiosInstanse.get<ApplicationResponse[]>(
    `/responses/my`,
  );
  return response.data;
}

// Принять/отклонить отклик
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

// Проверить, откликался ли пользователь на заявку
export async function checkUserResponse(applicationId: string) {
  try {
    const responses = await getMyResponses();
    return responses.find((r) => r.application_id === applicationId);
  } catch {
    return undefined;
  }
}
