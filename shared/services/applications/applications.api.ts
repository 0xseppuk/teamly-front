import { axiosInstanse } from '../axios';
import { ApplicationsResponse, CreateApplicationDTO, GameApplication } from './applications.types';

export async function createApplication(data: CreateApplicationDTO) {
  const response = await axiosInstanse.post<{
    message: string;
    application: GameApplication;
  }>('/applications', data);
  return response.data;
}

export async function getUserApplications() {
  const response = await axiosInstanse.get<ApplicationsResponse>('/applications/my');
  return response.data;
}

export async function getAllApplications(params?: {
  game_id?: string;
  platform?: string;
  with_voice_chat?: boolean;
}) {
  const response = await axiosInstanse.get<ApplicationsResponse>('/applications', {
    params,
  });
  return response.data;
}

export async function getApplicationById(id: string) {
  const response = await axiosInstanse.get<{
    application: GameApplication;
  }>(`/applications/${id}`);
  return response.data;
}

export async function updateApplication(id: string, data: CreateApplicationDTO) {
  const response = await axiosInstanse.patch<{
    message: string;
    application: GameApplication;
  }>(`/applications/${id}`, data);
  return response.data;
}

export async function deleteApplication(id: string) {
  const response = await axiosInstanse.delete<{
    message: string;
  }>(`/applications/${id}`);
  return response.data;
}
