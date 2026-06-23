import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import type { CanvasNode } from '../../types/page';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Registry } from '../../registry';

interface ComponentRendererProps {
  node: CanvasNode;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ node }) => {
  const { selectedNodeId, setSelectedNodeId, hoverState, isPreviewMode } = useBuilderStore();
  const isSelected = selectedNodeId === node.id && !isPreviewMode;
  
  const isHovered = hoverState?.overId === node.id;
  const config = Registry[node.type];
  
  // Graceful fallback for unknown nodes
  if (!config) {
    return <Typography color="error">Unknown Component: {node.type}</Typography>;
  }

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: node.id,
    disabled: !config.canHaveChildren || isPreviewMode,
    data: { isContainer: config.canHaveChildren }
  });

  const { setNodeRef: setDraggableRef, listeners, attributes, isDragging } = useDraggable({
    id: node.id,
    disabled: isPreviewMode,
    data: { isCanvasItem: true, nodeId: node.id }
  });

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    e.preventDefault();
    setSelectedNodeId(node.id);
  };

  const setRefs = (element: HTMLElement | null) => {
    setDraggableRef(element);
    if (config.canHaveChildren) {
      setDroppableRef(element);
    }
  };

  const renderChildren = () => {
    if (!node.children || node.children.length === 0) {
      if (config.canHaveChildren && !isPreviewMode) {
        return <Typography variant="caption" color="text.disabled" sx={{ p: 2, display: 'block', textAlign: 'center' }}>Empty {node.type}</Typography>;
      }
      return null;
    }
    return node.children.map(child => <ComponentRenderer key={child.id} node={child} />);
  };

  const wrapperSx = isPreviewMode ? { position: 'relative' } : {
    position: 'relative',
    cursor: isDragging ? 'grabbing' : 'pointer',
    border: isSelected ? '2px solid #2563EB' : '1px dashed transparent',
    opacity: isDragging ? 0.4 : 1,
    minHeight: config.canHaveChildren ? 50 : undefined,
    padding: config.canHaveChildren ? '4px' : undefined,
    userSelect: 'none',
    '&:hover': {
      border: isSelected ? '2px solid #2563EB' : '1px dashed #94A3B8',
    },
    transition: 'all 0.2s',
  };

  const renderHoverIndicators = () => {
    if (!isHovered) return null;
    if (hoverState.position === 'top') {
      return <Box sx={{ position: 'absolute', top: -2, left: 0, right: 0, height: 4, bgcolor: '#3B82F6', zIndex: 10 }} />;
    }
    if (hoverState.position === 'bottom') {
      return <Box sx={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 4, bgcolor: '#3B82F6', zIndex: 10 }} />;
    }
    if (hoverState.position === 'inside') {
      return <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, border: '2px solid #3B82F6', bgcolor: 'rgba(59, 130, 246, 0.1)', zIndex: 10, pointerEvents: 'none' }} />;
    }
    return null;
  };

  // Render the actual MUI component
  const Component = config.component;
  
  return (
    <Box
      ref={setRefs}
      onClick={handleClick}
      {...listeners}
      {...attributes}
      sx={wrapperSx}
    >
      {!isPreviewMode && renderHoverIndicators()}
      <Box sx={{ position: 'relative', zIndex: 0 }}>
        {config.renderLogic ? config.renderLogic(node.props, renderChildren()) : (
          <Component {...node.props}>
            {config.canHaveChildren ? renderChildren() : (node.props.children || renderChildren())}
          </Component>
        )}
      </Box>
    </Box>
  );
};

export default ComponentRenderer;
