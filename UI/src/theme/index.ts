import { createTheme, type PaletteMode } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { tokens } from './tokens';
import { darkPalette, darkComponents } from './dark';
import { lightPalette, lightComponents } from './light';

/** Shared component overrides that apply to both light and dark themes */
const sharedComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        padding: '10px 22px',
        fontSize: '0.9rem',
        boxShadow: 'none',
      },
      containedPrimary: {
        '&:hover': {
          boxShadow: '0 0 20px rgba(0,0,0,0.2)',
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 8, fontWeight: 500 },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
          transform: 'scale(1.05)',
        },
      },
    },
  },
};

/**
 * Creates the MUI theme for the given mode.
 * Merges shared tokens → mode-specific palette/components → shared component overrides.
 */
export function createAppTheme(mode: PaletteMode) {
  const modeSpecific = {
    palette: mode === 'dark' ? darkPalette : lightPalette,
    components: mode === 'dark' ? darkComponents : lightComponents,
  };

  return createTheme(
    deepmerge(
      {
        palette: {
          ...tokens.palette,
          ...modeSpecific.palette,
        },
        typography: tokens.typography,
        shape: tokens.shape,
        components: deepmerge(modeSpecific.components ?? {}, sharedComponents),
      },
      {},
    ),
  );
}
