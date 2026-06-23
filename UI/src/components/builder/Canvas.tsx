import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { useBuilderStore } from '../../store/useBuilderStore';
import ComponentRenderer from './ComponentRenderer';

const THEME_COLORS: Record<string, string> = {
  'enterprise-blue': '#2563EB',
  'midnight-violet': '#7C3AED',
  'forest-green': '#16A34A',
  'sunset-orange': '#EA580C',
  'monochrome': '#475569',
};

const Canvas: React.FC = () => {
  const { nodes, setSelectedNodeId, projectTheme } = useBuilderStore();
  const globalTheme = useTheme();
  
  const canvasTheme = useMemo(() => {
    const mainColor = THEME_COLORS[projectTheme] || THEME_COLORS['enterprise-blue'];
    return createTheme({
      ...globalTheme,
      palette: {
        ...globalTheme.palette,
        primary: {
          main: mainColor,
        }
      }
    });
  }, [globalTheme, projectTheme]);

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
    data: { isCanvasRoot: true }
  });

  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        bgcolor: '#F8FAFC', 
        p: 4, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={() => setSelectedNodeId(null)} // Click outside deselects
    >
      <ThemeProvider theme={canvasTheme}>
        <Box
          ref={setNodeRef}
          sx={{
            minHeight: '100%',
            bgcolor: 'background.paper',
            border: isOver ? '2px dashed #2563EB' : '1px solid #E2E8F0',
            borderRadius: 2,
            boxShadow: 1,
            p: 4,
            transition: 'border 0.2s',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {nodes.length === 0 ? (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled' }}>
              <Typography>Drag and drop components here to build your page</Typography>
            </Box>
          ) : (
            nodes.map(node => (
              <ComponentRenderer key={node.id} node={node} />
            ))
          )}
        </Box>
      </ThemeProvider>
    </Box>
  );
};

export default Canvas;
