import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import type { Project, ProjectStatus } from '../../types/project';

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  active:   { label: 'Active',    color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  draft:    { label: 'Draft',     color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  archived: { label: 'Archived',  color: '#94A3B8', bg: 'rgba(148,163,184,0.12)' },
};

const getInitials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// ─── Component ────────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const status = STATUS_CONFIG[project.status];

  return (
    <Card
      id={`project-card-${project._id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Enterprise-style left color bar instead of top bar */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: 4,
          background: project.color,
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 2.5, pl: 3.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography
            variant="subtitle1"
            title={project.name}
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'text.primary',
            }}
          >
            {project.name}
          </Typography>
          <Chip
            label={status.label}
            size="small"
            sx={{
              bgcolor: status.bg,
              color: status.color,
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 22,
              borderRadius: '4px',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
          <FolderOpenIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Created {formatDate(project.createdAt)}
          </Typography>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
            minHeight: 42,
          }}
        >
          {project.description || 'No description provided.'}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          px: 3,
          pb: 2,
          pt: 0,
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Tooltip title="Open project">
          <IconButton
            id={`project-open-${project._id}`}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main', background: 'rgba(124,58,237,0.08)' },
            }}
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete project">
          <IconButton
            id={`project-delete-${project._id}`}
            size="small"
            onClick={(e) => { e.stopPropagation(); onDelete(project._id); }}
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'error.main', background: 'rgba(239,68,68,0.08)' },
            }}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
