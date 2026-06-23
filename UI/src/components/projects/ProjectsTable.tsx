import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { Project, ProjectStatus } from '../../types/project';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#16A34A', bg: 'rgba(22, 163, 74, 0.1)' },
  draft: { label: 'Draft', color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)' },
  archived: { label: 'Archived', color: '#64748B', bg: 'rgba(100, 116, 139, 0.1)' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

interface ProjectsTableProps {
  projects: Project[];
  onDelete: (id: string) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects, onDelete }) => {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        bgcolor: 'background.paper',
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="projects table">
        <TableHead>
          <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', py: 1.5 }}>Project Name</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', py: 1.5 }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', py: 1.5 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary', py: 1.5 }}>Created</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary', py: 1.5 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => {
            const status = STATUS_CONFIG[project.status];
            return (
              <TableRow
                key={project._id}
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: project.color,
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {project.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: 300,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {project.description || '—'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={status.label}
                    size="small"
                    sx={{
                      bgcolor: status.bg,
                      color: status.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 24,
                      borderRadius: '6px',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(project.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title="Open">
                      <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'action.hover' } }}>
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(project._id)}
                        sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'error.lighter' } }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectsTable;
