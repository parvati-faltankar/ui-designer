import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Typography, Snackbar, Alert, ToggleButton, ToggleButtonGroup } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import { useBuilderStore, findNode } from '../../store/useBuilderStore';
import type { HoverState } from '../../store/useBuilderStore';
import { Registry } from '../../registry';

const BuilderLayout: React.FC = () => {
  const { projectId, pageId } = useParams<{ projectId: string; pageId: string }>();
  const navigate = useNavigate();
  const { addNode, moveNode, nodes, setHoverState, hoverState, isPreviewMode, setPreviewMode } = useBuilderStore();
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [activeDragType, setActiveDragType] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Start drag after 5px movement to allow clicks
      },
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    if (active.data.current?.isPaletteItem) {
      setActiveDragType(active.data.current.type);
    } else {
      const node = findNode(nodes, active.id);
      if (node) setActiveDragType(node.type);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;
    
    if (!over) {
      setHoverState(null);
      return;
    }

    if (over.id === 'canvas-root') {
      setHoverState({ overId: 'canvas-root', position: 'inside' });
      return;
    }

    // We are over a node
    const overNode = findNode(nodes, over.id as string);
    if (!overNode) return;

    // Determine position based on mouse coordinates relative to the over element
    // @dnd-kit provides `active.rect.current.translated` and `over.rect`
    const overRect = over.rect;
    const activeRect = active.rect.current.translated;
    
    if (!overRect || !activeRect) return;

    const isContainer = Registry[overNode.type]?.canHaveChildren || false;

    const relativeY = activeRect.top - overRect.top;
    const height = overRect.height;
    const ratio = relativeY / height;

    let position: 'top' | 'bottom' | 'inside' = 'inside';

    if (isContainer) {
      // Containers have 3 zones: top 25%, middle 50%, bottom 25%
      if (ratio < 0.25) position = 'top';
      else if (ratio > 0.75) position = 'bottom';
      else position = 'inside';
    } else {
      // Leaves have 2 zones: top 50%, bottom 50%
      if (ratio < 0.5) position = 'top';
      else position = 'bottom';
    }

    let targetParentId = 'canvas-root';
    if (position === 'inside') {
      targetParentId = overNode.id;
    } else {
      const loc = getParentIdAndIndex(nodes, overNode.id);
      if (loc) targetParentId = loc.parentId;
    }

    const targetParentNode = targetParentId === 'canvas-root' ? null : findNode(nodes, targetParentId);
    
    const activeType = active.data.current?.isPaletteItem 
      ? active.data.current.type 
      : findNode(nodes, active.id as string)?.type;

    if (activeType) {
      const dragConfig = Registry[activeType];
      const parentType = targetParentNode ? targetParentNode.type : 'Canvas';
      const parentConfig = targetParentNode ? Registry[parentType] : null;

      if (parentConfig?.allowedChildren && !parentConfig.allowedChildren.includes(activeType)) {
        setHoverState(null);
        return;
      }
      if (dragConfig?.allowedParents && !dragConfig.allowedParents.includes(parentType)) {
        setHoverState(null);
        return;
      }
    }

    // Prevent rendering hover state if nothing changed to avoid flicker
    setHoverState({ overId: overNode.id, position });
  };

  const getParentIdAndIndex = (nodesList: any[], targetId: string): { parentId: string, index: number } | null => {
    for (let i = 0; i < nodesList.length; i++) {
      if (nodesList[i].id === targetId) {
        return { parentId: 'canvas-root', index: i };
      }
      if (nodesList[i].children) {
        for (let j = 0; j < nodesList[i].children.length; j++) {
          if (nodesList[i].children[j].id === targetId) {
            return { parentId: nodesList[i].id, index: j };
          }
        }
        const deep = getParentIdAndIndex(nodesList[i].children, targetId);
        if (deep) return deep;
      }
    }
    return null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragType(null);
    const { active, over } = event;
    const currentHover = useBuilderStore.getState().hoverState;
    setHoverState(null);

    if (!over || !currentHover) return;

    const isPaletteItem = active.data.current?.isPaletteItem;
    const activeType = active.data.current?.type;
    const activeId = active.id as string;

    const { overId, position } = currentHover;

    let targetParentId = 'canvas-root';
    let targetIndex: number | undefined = undefined;

    if (overId !== 'canvas-root') {
      if (position === 'inside') {
        targetParentId = overId;
        // append to end
      } else {
        // We need to insert before or after the overId node
        const loc = getParentIdAndIndex(nodes, overId);
        if (loc) {
          targetParentId = loc.parentId;
          targetIndex = position === 'top' ? loc.index : loc.index + 1;
        }
      }
    }

    if (isPaletteItem && activeType) {
      addNode(activeType, targetParentId, targetIndex);
    } else {
      moveNode(activeId, targetParentId, targetIndex);
    }
  };

  const handleSave = async () => {
    try {
      const payload = { layoutTree: nodes };
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSnack({ open: true, message: 'Page saved successfully', severity: 'success' });
    } catch (err: any) {
      setSnack({ open: true, message: err.message, severity: 'error' });
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        
        {/* Top Navbar */}
        <Box sx={{ height: 56, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, zIndex: 1200 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Back to Settings">
              <IconButton size="small" onClick={() => navigate(`/projects/${projectId}/settings`)}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Page Builder</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ToggleButtonGroup
              size="small"
              value={isPreviewMode ? 'preview' : 'editor'}
              exclusive
              onChange={(_, value) => {
                if (value !== null) setPreviewMode(value === 'preview');
              }}
              aria-label="Mode"
            >
              <ToggleButton value="editor" aria-label="Editor">
                <EditIcon fontSize="small" sx={{ mr: 1 }} /> Editor
              </ToggleButton>
              <ToggleButton value="preview" aria-label="Preview">
                <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> Preview
              </ToggleButton>
            </ToggleButtonGroup>

            <Tooltip title="Save Page">
              <IconButton size="small" color="primary" onClick={handleSave}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Builder Workspace */}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {!isPreviewMode && <Sidebar />}
          <Box sx={{ flexGrow: 1, overflow: 'hidden', transition: 'width 0.3s' }}>
            <Canvas />
          </Box>
          {!isPreviewMode && <PropertiesPanel />}
        </Box>

        {/* Drag Overlay for visual feedback while dragging */}
        {!isPreviewMode && (
          <DragOverlay>
            {activeDragType ? (
              <Box sx={{ p: 2, border: '2px solid #2563EB', bgcolor: 'rgba(37, 99, 235, 0.1)', borderRadius: 1, color: '#2563EB', fontWeight: 'bold' }}>
                Dragging {activeDragType}
              </Box>
            ) : null}
          </DragOverlay>
        )}
      </Box>
      
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} variant="filled">{snack.message}</Alert>
      </Snackbar>
    </DndContext>
  );
};

export default BuilderLayout;
