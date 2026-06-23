import type { ThemeOptions } from '@mui/material/styles';

export const lightPalette: ThemeOptions['palette'] = {
  mode: 'light',
  background: {
    default: '#F8FAFC', // Slate 50
    paper: '#FFFFFF',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
  },
  divider: '#E2E8F0', // Slate 200
};

export const lightComponents: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        scrollbarColor: '#C4B5FD #F8F7FF',
        '&::-webkit-scrollbar': { width: 6 },
        '&::-webkit-scrollbar-track': { background: '#F8F7FF' },
        '&::-webkit-scrollbar-thumb': { background: '#C4B5FD', borderRadius: 3 },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: 'none',
        color: '#0F172A',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          border: '1px solid #CBD5E1',
          transform: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 8,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: '#E2E8F0' },
          '&:hover fieldset': { borderColor: '#CBD5E1' },
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
