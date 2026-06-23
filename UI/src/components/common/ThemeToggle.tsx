import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeStore } from '../../store/themeStore';

const ThemeToggle: React.FC = () => {
  const { mode, toggleMode } = useThemeStore();
  const isDark = mode === 'dark';

  return (
    <Tooltip title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'} arrow>
      <IconButton
        id="theme-toggle-btn"
        onClick={toggleMode}
        size="small"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        sx={{
          width: 38,
          height: 38,
          borderRadius: '10px',
          border: '1px solid',
          borderColor: 'divider',
          color: 'text.secondary',
          transition: 'all 0.25s ease',
          '&:hover': {
            color: 'primary.main',
            borderColor: 'primary.main',
            background: 'rgba(124,58,237,0.08)',
            transform: 'rotate(15deg)',
          },
        }}
      >
        {isDark ? (
          <LightModeIcon sx={{ fontSize: 18 }} />
        ) : (
          <DarkModeIcon sx={{ fontSize: 18 }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
