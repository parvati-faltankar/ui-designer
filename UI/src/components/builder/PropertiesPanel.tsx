import React, { useState } from 'react';
import { Box, Typography, TextField, Divider, IconButton, FormControlLabel, Switch, MenuItem, Breadcrumbs, Link, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { useBuilderStore, findNode } from '../../store/useBuilderStore';
import { Registry } from '../../registry';

const PropertiesPanel: React.FC = () => {
  const { nodes, selectedNodeId, updateNodeProps, removeNode, setSelectedNodeId } = useBuilderStore();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const getBreadcrumbs = (nodesList: any[], targetId: string, currentPath: any[] = []): any[] | null => {
    for (const node of nodesList) {
      const path = [...currentPath, node];
      if (node.id === targetId) return path;
      if (node.children) {
        const found = getBreadcrumbs(node.children, targetId, path);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = selectedNodeId ? findNode(nodes, selectedNodeId) : null;
  const breadcrumbs = selectedNodeId ? getBreadcrumbs(nodes, selectedNodeId) : [];

  if (!selectedNode) {
    return (
      <Box sx={{ width: 320, borderLeft: '1px solid', borderColor: 'divider', bgcolor: 'background.default', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.disabled" align="center">Select a component to edit its properties.</Typography>
      </Box>
    );
  }

  const handleChange = (field: string, value: any) => {
    updateNodeProps(selectedNode.id, { [field]: value });
  };

  const config = Registry[selectedNode.type];

  if (!config) {
    return (
      <Box sx={{ width: 320, p: 3 }}><Typography color="error">Unknown component type</Typography></Box>
    );
  }

  const renderSchemaFields = (schema: any[]) => {
    return schema.map((prop) => {
      const value = selectedNode.props[prop.name] ?? '';

      if (prop.type === 'text' || prop.type === 'number') {
        return (
          <TextField
            key={prop.name}
            size="small"
            label={prop.label}
            type={prop.type === 'number' ? 'number' : 'text'}
            value={value}
            onChange={(e) => handleChange(prop.name, prop.type === 'number' ? Number(e.target.value) : e.target.value)}
            fullWidth
          />
        );
      }

      if (prop.type === 'select') {
        return (
          <TextField
            key={prop.name}
            size="small"
            select
            label={prop.label}
            value={value}
            onChange={(e) => handleChange(prop.name, e.target.value)}
            fullWidth
          >
            {prop.options?.map((opt: any) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        );
      }

      if (prop.type === 'boolean') {
        return (
          <FormControlLabel
            key={prop.name}
            control={<Switch size="small" checked={Boolean(value)} onChange={(e) => handleChange(prop.name, e.target.checked)} />}
            label={prop.label}
          />
        );
      }

      return null;
    });
  };

  return (
    <Box sx={{ width: 320, borderLeft: '1px solid', borderColor: 'divider', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 1 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{config.label} Properties</Typography>
          {breadcrumbs && breadcrumbs.length > 1 && (
            <Breadcrumbs maxItems={3} aria-label="breadcrumb" sx={{ mt: 0.5, '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' }, '& .MuiBreadcrumbs-li': { whiteSpace: 'nowrap' } }}>
              {breadcrumbs.slice(0, -1).map((crumb: any, index: number) => (
                <Link
                  key={crumb.id}
                  component="button"
                  variant="caption"
                  onClick={() => setSelectedNodeId(crumb.id)}
                  sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  {Registry[crumb.type]?.label || crumb.type}
                </Link>
              ))}
              <Typography variant="caption" color="text.primary">
                {config.label}
              </Typography>
            </Breadcrumbs>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexShrink: 0 }}>
          <IconButton size="small" onClick={() => removeNode(selectedNode.id)} color="error" title="Delete Component">
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setSelectedNodeId(null)} title="Close Properties">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      
      <Box sx={{ p: 2, overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {renderSchemaFields(config.mainSchema || [])}

        {(!config.mainSchema || config.mainSchema.length === 0) && (
          <Typography color="text.secondary" variant="body2" align="center">No primary properties for this component.</Typography>
        )}
      </Box>

      {config.advancedSchema && config.advancedSchema.length > 0 && (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            variant="outlined" 
            fullWidth 
            startIcon={<SettingsIcon />}
            onClick={() => setAdvancedOpen(true)}
          >
            Advanced Settings
          </Button>
        </Box>
      )}

      {/* Advanced Settings Modal */}
      <Dialog 
        open={advancedOpen} 
        onClose={() => setAdvancedOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{config.label} Advanced Settings</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
            {renderSchemaFields(config.advancedSchema || [])}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdvancedOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertiesPanel;
