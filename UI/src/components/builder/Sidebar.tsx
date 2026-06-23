import React from 'react';
import { Box, Typography, Paper, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDraggable } from '@dnd-kit/core';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Registry } from '../../registry';

const DraggableItem: React.FC<{ type: string; label: string }> = ({ type, label }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, isPaletteItem: true }
  });

  return (
    <Paper
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      variant="outlined"
      sx={{
        p: 1.5,
        mb: 1.5,
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'background.paper',
        opacity: isDragging ? 0.5 : 1,
        '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(37, 99, 235, 0.04)' },
      }}
    >
      <DragIndicatorIcon color="action" fontSize="small" />
      <Typography variant="body2">{label}</Typography>
    </Paper>
  );
};

const Sidebar: React.FC = () => {
  // Group components by category
  const categories: Record<string, any[]> = {
    'Layout': [],
    'Surfaces': [],
    'Inputs': [],
    'Data Display': [],
    'Feedback': []
  };

  Object.values(Registry).forEach(comp => {
    if (categories[comp.category]) {
      categories[comp.category].push(comp);
    }
  });

  return (
    <Box sx={{ width: 280, borderRight: '1px solid', borderColor: 'divider', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>Component Palette</Typography>
      </Box>
      <Divider />
      <Box sx={{ overflowY: 'auto', flexGrow: 1, p: 1 }}>
        {Object.entries(categories).map(([category, components]) => {
          if (components.length === 0) return null;
          return (
            <Accordion key={category} defaultExpanded disableGutters elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 40, '& .MuiAccordionSummary-content': { my: 1 } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.75rem' }}>
                  {category}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, px: 1 }}>
                {components.map(comp => (
                  <DraggableItem key={comp.type} type={comp.type} label={comp.label} />
                ))}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
};

export default Sidebar;
