import axios from 'axios';
import type { Project, CreateProjectPayload, ApiResponse } from '../types/project';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const { data } = await client.get<ApiResponse<Project[]>>('/projects');
    return data.data;
  },

  create: async (payload: CreateProjectPayload): Promise<Project> => {
    const { data } = await client.post<ApiResponse<Project>>('/projects', payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/projects/${id}`);
  },
};
