import React, { useState, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, IconButton, CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import type { CreateProjectPayload } from '../../types/project';
import { PROJECT_COLORS } from '../../theme/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateProjectPayload) => Promise<void>;
}

interface FormState {
  name: string;
  description: string;
  color: string;
  nameError: string;
}

const INITIAL_FORM: FormState = {
  name: '',
  description: '',
  color: PROJECT_COLORS[0],
  nameError: '',
};

// ─── Component ────────────────────────────────────────────────────────────────

const AddProjectDialog: React.FC<AddProjectDialogProps> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const reset = useCallback(() => setForm(INITIAL_FORM), []);

  const handleClose = () => { reset(); onClose(); };

  const handleChange =
    (field: keyof Pick<FormState, 'name' | 'description'>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
        ...(field === 'name' ? { nameError: '' } : {}),
      }));
    };

  const validate = (): boolean => {
    if (!form.name.trim()) {
      setForm((prev) => ({ ...prev, nameError: 'Project name is required' }));
      return false;
    }
    if (form.name.trim().length < 2) {
      setForm((prev) => ({ ...prev, nameError: 'Name must be at least 2 characters' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({ name: form.name.trim(), description: form.description.trim(), color: form.color });
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      id="add-project-dialog"
      PaperProps={{ sx: { p: 1 } }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36, height: 36, borderRadius: '6px',
                bgcolor: 'action.hover',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <RocketLaunchIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2, color: 'text.primary' }}>
                New Project
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new workspace
              </Typography>
            </Box>
          </Box>
          <IconButton id="dialog-close-btn" onClick={handleClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Name */}
        <TextField
          id="project-name-input"
          label="Project Name"
          placeholder="e.g. E-commerce Dashboard"
          value={form.name}
          onChange={handleChange('name')}
          onKeyDown={handleKeyDown}
          error={!!form.nameError}
          helperText={form.nameError}
          fullWidth
          autoFocus
          sx={{ mb: 2.5 }}
        />

        {/* Description */}
        <TextField
          id="project-description-input"
          label="Description"
          placeholder="Brief description (optional)"
          value={form.description}
          onChange={handleChange('description')}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 3 }}
        />

        {/* Color picker */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
            Project Color
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {PROJECT_COLORS.map((color) => {
              const isSelected = form.color === color;
              return (
                <Box
                  key={color}
                  id={`color-swatch-${color.replace('#', '')}`}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Select color ${color}`}
                  onClick={() => setForm((prev) => ({ ...prev, color }))}
                  sx={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: color, cursor: 'pointer',
                    border: isSelected ? '3px solid #fff' : '3px solid transparent',
                    outline: `2px solid ${isSelected ? color : 'transparent'}`,
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                    boxShadow: isSelected ? `0 0 12px ${color}80` : 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': { transform: 'scale(1.1)', boxShadow: `0 0 10px ${color}60` },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* Preview */}
        <Box
          sx={{
            mt: 3, p: 2, borderRadius: 2,
            background: 'rgba(124,58,237,0.05)',
            border: '1px solid', borderColor: 'divider',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600, letterSpacing: '0.08em' }}>
            PREVIEW
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36, height: 36, borderRadius: '8px',
                background: `linear-gradient(135deg, ${form.color}CC, ${form.color}66)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, color: '#fff',
                border: `2px solid ${form.color}40`,
              }}
            >
              {form.name ? form.name.slice(0, 2).toUpperCase() : 'PR'}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: form.name ? 'text.primary' : 'text.secondary' }}>
              {form.name || 'Project Name'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1.5 }}>
        <Button
          id="dialog-cancel-btn"
          onClick={handleClose}
          variant="outlined"
          color="inherit"
          sx={{ flex: 1, borderColor: 'divider', color: 'text.secondary' }}
        >
          Cancel
        </Button>
        <Button
          id="dialog-submit-btn"
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ flex: 1 }}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RocketLaunchIcon />}
        >
          {loading ? 'Creating…' : 'Create Project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectDialog;
