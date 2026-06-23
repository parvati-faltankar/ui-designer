import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  useProjectStore,
  selectFilteredProjects,
  selectProjectStats,
} from '../store/projectStore';

/**
 * Encapsulates all project-related state and actions.
 * Pages/components import this hook instead of reaching into the store directly,
 * keeping them decoupled from the store implementation.
 */
export function useProjects() {
  const store = useProjectStore(
    useShallow((s) => ({
      projects: s.projects,
      loading: s.loading,
      dialogOpen: s.dialogOpen,
      searchQuery: s.searchQuery,
      statusFilter: s.statusFilter,
      snack: s.snack,
      fetchProjects: s.fetchProjects,
      createProject: s.createProject,
      deleteProject: s.deleteProject,
      updateProject: s.updateProject,
      setDialogOpen: s.setDialogOpen,
      setSearchQuery: s.setSearchQuery,
      setStatusFilter: s.setStatusFilter,
      closeSnack: s.closeSnack,
    })),
  );

  const filteredProjects = useProjectStore(useShallow(selectFilteredProjects));
  const stats = useProjectStore(useShallow(selectProjectStats));

  // Fetch on mount — stable reference from Zustand means this won't re-fire
  useEffect(() => {
    store.fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...store, filteredProjects, stats };
}
