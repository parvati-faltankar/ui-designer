import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { PaletteMode } from '@mui/material';

interface ThemeStore {
  mode: PaletteMode;
  toggleMode: () => void;
  setMode: (mode: PaletteMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set) => ({
        mode: 'dark' as PaletteMode,

        toggleMode: () =>
          set(
            (state) => ({ mode: state.mode === 'dark' ? 'light' : 'dark' }),
            false,
            'toggleMode',
          ),

        setMode: (mode) => set({ mode }, false, 'setMode'),
      }),
      {
        name: 'ui-studio-theme', // localStorage key
        partialize: (state) => ({ mode: state.mode }), // only persist mode, not actions
      },
    ),
    { name: 'UIStudio/ThemeStore' },
  ),
);
