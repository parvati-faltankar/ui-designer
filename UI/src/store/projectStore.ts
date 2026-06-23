import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Project, CreateProjectPayload } from '../types/project';
import { projectsApi } from '../api/projects';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SnackSeverity = 'success' | 'error' | 'info';

export interface SnackState {
  open: boolean;
  message: string;
  severity: SnackSeverity;
}

interface ProjectStore {
  // State
  projects: Project[];
  loading: boolean;
  dialogOpen: boolean;
  searchQuery: string;
  statusFilter: string;
  snack: SnackState;

  // Actions
  fetchProjects: () => Promise<void>;
  createProject: (payload: CreateProjectPayload) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setDialogOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: string) => void;
  closeSnack: () => void;
  showSnack: (message: string, severity?: SnackSeverity) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useProjectStore = create<ProjectStore>()(
  devtools(
    (set, get) => ({
      projects: [],
      loading: false,
      dialogOpen: false,
      searchQuery: '',
      statusFilter: 'all',
      snack: { open: false, message: '', severity: 'success' },

      fetchProjects: async () => {
        set({ loading: true }, false, 'fetchProjects/pending');
        try {
          const data = await projectsApi.getAll();
          set({ projects: data, loading: false }, false, 'fetchProjects/fulfilled');
        } catch {
          set({ loading: false }, false, 'fetchProjects/rejected');
          get().showSnack('Failed to load projects. Is the backend running?', 'error');
        }
      },

      createProject: async (payload) => {
        const project = await projectsApi.create(payload);
        set(
          (s) => ({ projects: [project, ...s.projects] }),
          false,
          'createProject',
        );
        get().showSnack(`"${project.name}" created successfully! 🚀`, 'success');
      },

      deleteProject: async (id) => {
        const name = get().projects.find((p) => p._id === id)?.name;
        try {
          await projectsApi.delete(id);
          set(
            (s) => ({ projects: s.projects.filter((p) => p._id !== id) }),
            false,
            'deleteProject',
          );
          get().showSnack(`"${name}" deleted.`, 'success');
        } catch {
          get().showSnack('Failed to delete project.', 'error');
        }
      },

      setDialogOpen: (open) => set({ dialogOpen: open }, false, 'setDialogOpen'),
      setSearchQuery: (query) => set({ searchQuery: query }, false, 'setSearchQuery'),
      setStatusFilter: (filter) => set({ statusFilter: filter }, false, 'setStatusFilter'),
      closeSnack: () =>
        set((s) => ({ snack: { ...s.snack, open: false } }), false, 'closeSnack'),
      showSnack: (message, severity = 'success') =>
        set({ snack: { open: true, message, severity } }, false, 'showSnack'),
    }),
    { name: 'UIStudio/ProjectStore' },
  ),
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectFilteredProjects = (s: ProjectStore): Project[] => {
  const q = s.searchQuery.toLowerCase();
  return s.projects.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    const matchStatus = s.statusFilter === 'all' || p.status === s.statusFilter;
    return matchSearch && matchStatus;
  });
};

export const selectProjectStats = (s: ProjectStore) => ({
  total: s.projects.length,
  active: s.projects.filter((p) => p.status === 'active').length,
  draft: s.projects.filter((p) => p.status === 'draft').length,
  archived: s.projects.filter((p) => p.status === 'archived').length,
});
