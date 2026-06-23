import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Snackbar,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import EnterpriseLayout from "../components/layout/EnterpriseLayout";
import AddProjectDialog from "../components/projects/AddProjectDialog";
import EmptyState from "../components/projects/EmptyState";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectsTable from "../components/projects/ProjectsTable";
import { useProjects } from "../hooks/useProjects";

const LandingPage: React.FC = () => {
  const {
    loading,
    dialogOpen,
    searchQuery,
    statusFilter,
    snack,
    filteredProjects,
    stats,
    createProject,
    deleteProject,
    setDialogOpen,
    setSearchQuery,
    setStatusFilter,
    closeSnack,
  } = useProjects();

  const [view, setView] = useState<"grid" | "list">("list"); // Default to list for enterprise

  const hasProjects = stats.total > 0;
  const hasResults = filteredProjects.length > 0;

  return (
    <EnterpriseLayout>
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}
            >
              Projects
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and organize all your UI design applications.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ borderRadius: "6px", px: 3, py: 1 }}
          >
            New Project
          </Button>
        </Box>

        {/* ── Stats Bar ─────────────────────────────────────────────────── */}
        {!loading && hasProjects && (
          <Box sx={{ display: "flex", gap: 1.5, mb: 4, flexWrap: "wrap" }}>
            {(
              [
                { label: "Total", count: stats.total, color: "#2563EB" },
                { label: "Active", count: stats.active, color: "#16A34A" },
                { label: "Draft", count: stats.draft, color: "#D97706" },
                { label: "Archived", count: stats.archived, color: "#64748B" },
              ] as const
            ).map(({ label, count, color }) => (
              <Chip
                key={label}
                label={`${count} ${label}`}
                size="small"
                sx={{
                  bgcolor: "transparent",
                  border: "1px solid",
                  borderColor: "divider",
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  borderRadius: "6px",
                  "& .MuiChip-label": { px: 1.5 },
                  // Add a small colored dot
                  "&::before": {
                    content: '""',
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: color,
                    ml: 1,
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* ── Search & Filter ───────────────────────────────────────────── */}
        {!loading && hasProjects && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 4,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, flexGrow: 1, maxWidth: 600 }}>
              <TextField
                id="projects-search"
                placeholder="Search projects…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ flexGrow: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, newView) => {
                if (newView) setView(newView);
              }}
              size="small"
              aria-label="project view toggle"
            >
              <ToggleButton value="list" aria-label="list view">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="grid" aria-label="grid view">
                <ViewModuleIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {/* ── Content ───────────────────────────────────────────────────── */}
        {loading ? (
          <Box>
            <Skeleton
              variant="rounded"
              height={40}
              sx={{ mb: 1, borderRadius: 1 }}
            />
            <Skeleton
              variant="rounded"
              height={60}
              sx={{ mb: 1, borderRadius: 1 }}
            />
            <Skeleton
              variant="rounded"
              height={60}
              sx={{ mb: 1, borderRadius: 1 }}
            />
            <Skeleton
              variant="rounded"
              height={60}
              sx={{ mb: 1, borderRadius: 1 }}
            />
          </Box>
        ) : !hasProjects ? (
          <EmptyState onAddProject={() => setDialogOpen(true)} />
        ) : hasResults ? (
          view === "grid" ? (
            <Grid container spacing={3}>
              {filteredProjects.map((project) => (
                <Grid key={project._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <ProjectCard project={project} onDelete={deleteProject} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <ProjectsTable
              projects={filteredProjects}
              onDelete={deleteProject}
            />
          )
        ) : (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <SearchIcon sx={{ fontSize: 40, color: "text.disabled", mb: 2 }} />
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              No results for "{searchQuery}"
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Dialog ───────────────────────────────────────────────────────── */}
      <AddProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={createProject}
      />

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          onClose={closeSnack}
          sx={{ fontWeight: 500 }}
          variant="filled"
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </EnterpriseLayout>
  );
};

export default LandingPage;
