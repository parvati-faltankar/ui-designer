export type ProjectStatus = 'active' | 'draft' | 'archived';

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  color: string;
  themeTemplate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  color?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
