import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Paper, Divider, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, Tooltip } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import EnterpriseLayout from '../components/layout/EnterpriseLayout';
import { useProjects } from '../hooks/useProjects';

const THEME_OPTIONS = [
  { value: 'enterprise-blue', label: 'Enterprise Blue', color: '#2563EB' },
  { value: 'midnight-violet', label: 'Midnight Violet', color: '#7C3AED' },
  { value: 'forest-green', label: 'Forest Green', color: '#16A34A' },
  { value: 'sunset-orange', label: 'Sunset Orange', color: '#EA580C' },
  { value: 'monochrome', label: 'Monochrome Slate', color: '#475569' },
];

const ProjectSettings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, updateProject } = useProjects();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [themeTemplate, setThemeTemplate] = useState('enterprise-blue');
  const [saving, setSaving] = useState(false);

  // Pages state
  const [pages, setPages] = useState<any[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageRoute, setNewPageRoute] = useState('');
  const [creatingPage, setCreatingPage] = useState(false);

  const project = projects.find(p => p._id === id);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || '');
      setThemeTemplate(project.themeTemplate || 'enterprise-blue');
    }
  }, [project]);

  useEffect(() => {
    if (project) {
      // Fetch pages for this project
      fetch(`/api/pages/${project._id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setPages(data.data);
        })
        .catch(console.error);
    }
  }, [project]);

  if (!project) {
    return (
      <EnterpriseLayout>
        <Box sx={{ p: 4 }}><Typography>Project not found.</Typography></Box>
      </EnterpriseLayout>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProject(project._id, { name, description, themeTemplate });
      // Theme save complete
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleCreatePage = async () => {
    setCreatingPage(true);
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project._id, name: newPageName, route: newPageRoute }),
      });
      const data = await res.json();
      if (data.success) {
        setPages([...pages, data.data]);
        setCreateDialogOpen(false);
        setNewPageName('');
        setNewPageRoute('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingPage(false);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      await fetch(`/api/pages/${pageId}`, { method: 'DELETE' });
      setPages(pages.filter(p => p._id !== pageId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <EnterpriseLayout>
      <Box sx={{ maxWidth: 1000, mx: 'auto', width: '100%', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Project Settings</Typography>
        </Box>

        <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>General</Typography>
              <TextField
                fullWidth
                label="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Theme Template</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select a predefined theme for all pages inside this project.
              </Typography>
              
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={themeTemplate}
                  label="Theme"
                  onChange={(e) => setThemeTemplate(e.target.value)}
                >
                  {THEME_OPTIONS.map((theme) => (
                    <MenuItem key={theme.value} value={theme.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: theme.color }} />
                        {theme.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSave} 
                disabled={saving || !name.trim()}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6">Pages</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage the UI pages inside this project.
              </Typography>
            </Box>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
              New Page
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {pages.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 2 }}>No pages created yet.</Typography>
          ) : (
            <List>
              {pages.map((page) => (
                <ListItem 
                  key={page._id} 
                  sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Open Page Builder">
                        <IconButton onClick={() => navigate(`/projects/${project._id}/builder/${page._id}`)} color="primary">
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Page">
                        <IconButton edge="end" onClick={() => handleDeletePage(page._id)} color="error">
                          <DeleteOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemText primary={page.name} secondary={`Route: ${page.route}`} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>

      {/* Create Page Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Page</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Page Name"
            fullWidth
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="e.g. Dashboard"
          />
          <TextField
            margin="dense"
            label="Page Route"
            fullWidth
            value={newPageRoute}
            onChange={(e) => setNewPageRoute(e.target.value)}
            placeholder="e.g. /dashboard"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreatePage}
            disabled={!newPageName.trim() || !newPageRoute.trim() || creatingPage}
          >
            {creatingPage ? 'Creating...' : 'Create Page'}
          </Button>
        </DialogActions>
      </Dialog>
    </EnterpriseLayout>
  );
};

export default ProjectSettings;
