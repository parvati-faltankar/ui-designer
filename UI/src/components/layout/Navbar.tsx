import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ThemeToggle from '../common/ThemeToggle';

interface NavbarProps {
  onAddProject: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAddProject }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        transition: 'all 0.3s ease-in-out',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: { xs: 64, md: 72 }, gap: 2 }}>
        {/* ── Brand ─────────────────────────────────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
              flexShrink: 0,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 20, color: '#fff' }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1rem', md: '1.15rem' },
                background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
              }}
            >
              UI Studio
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                fontWeight: 600,
              }}
            >
              DESIGN SYSTEM
            </Typography>
          </Box>
        </Box>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <ThemeToggle />

        {isMobile ? (
          <IconButton
            id="navbar-add-project-btn-mobile"
            onClick={onAddProject}
            aria-label="Add new project"
            sx={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
              color: '#fff',
              width: 38,
              height: 38,
              borderRadius: '10px',
              '&:hover': {
                background: 'linear-gradient(135deg, #9D5CF6 0%, #7C3AED 100%)',
                boxShadow: '0 0 20px rgba(124,58,237,0.4)',
              },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        ) : (
          <Button
            id="navbar-add-project-btn"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddProject}
            sx={{ px: 3, whiteSpace: 'nowrap' }}
          >
            New Project
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
