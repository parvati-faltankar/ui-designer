/** Shared design tokens used by both light and dark themes */
export const tokens = {
  palette: {
    primary: {
      main: '#2563EB', // Enterprise Blue
      light: '#3B82F6',
      dark: '#1D4ED8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#475569', // Slate
      light: '#64748B',
      dark: '#334155',
      contrastText: '#ffffff',
    },
    error: { main: '#DC2626' },
    success: { main: '#16A34A' },
    warning: { main: '#D97706' },
  },
  shape: { borderRadius: 6 }, // Sharp enterprise corners
  typography: {
    fontFamily: '"Inter", "Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h3: { fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.3 },
    h4: { fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.4 },
    h5: { fontWeight: 600, lineHeight: 1.5 },
    h6: { fontWeight: 600, lineHeight: 1.5 },
    body1: { lineHeight: 1.6, letterSpacing: '0.01em' },
    body2: { lineHeight: 1.5, letterSpacing: '0.01em' },
    button: { fontWeight: 600, textTransform: 'none' as const, letterSpacing: '0.015em' },
  },
  // Reusable shadow sets per theme
  shadows: {
    primary: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    card: {
      hover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }
  },
} as const;

/** Project accent colors available in the dialog */
export const PROJECT_COLORS = [
  '#2563EB', // Blue
  '#0EA5E9', // Sky
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#6366F1', // Indigo
  '#64748B', // Slate
] as const;

export type ProjectColor = (typeof PROJECT_COLORS)[number];
