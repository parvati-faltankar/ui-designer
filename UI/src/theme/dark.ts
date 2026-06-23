import type { ThemeOptions } from '@mui/material/styles';

export const darkPalette: ThemeOptions['palette'] = {
  mode: 'dark',
  background: {
    default: '#0F172A', // Slate 900
    paper: '#1E293B',   // Slate 800
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
  },
  divider: '#334155', // Slate 700
};

export const darkComponents: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        scrollbarColor: '#7C3AED #0A0A0F',
        '&::-webkit-scrollbar': { width: 6 },
        '&::-webkit-scrollbar-track': { background: '#0A0A0F' },
        '&::-webkit-scrollbar-thumb': { background: '#7C3AED', borderRadius: 3 },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        background: '#0F172A',
        borderBottom: '1px solid #334155',
        boxShadow: 'none',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        background: '#1E293B',
        border: '1px solid #334155',
        backdropFilter: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          border: '1px solid #475569',
          transform: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        background: '#1E293B',
        border: '1px solid #334155',
        borderRadius: 8,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: '#334155' },
          '&:hover fieldset': { borderColor: '#475569' },
          '&.Mui-focused fieldset': {
            borderColor: '#2563EB',
            borderWidth: '1px',
            boxShadow: '0 0 0 2px rgba(37,99,235,0.2)',
          },
        },
      },
    },
  },
};
