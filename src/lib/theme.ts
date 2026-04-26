/**
 * Design System Theme Configuration
 */

export const colors = {
  light: {
    primary: '#4F46E5',      // Indigo - intelligence, trust
    accent: '#22C55E',       // Success / progress
    background: '#F8FAFC',   // Soft neutral
    surface: '#FFFFFF',      // Cards, modals
    text: '#0F172A',         // Primary text
    textMuted: '#64748B',    // Secondary text
    error: '#EF4444',        // Error states
    warning: '#F59E0B',      // Warning states
    info: '#3B82F6',         // Info states
    border: '#E2E8F0',       // Borders, dividers
    inputBackground: '#F1F5F9',
    disabled: '#CBD5E1',
  },
  dark: {
    primary: '#6366F1',      // Lighter indigo for dark mode
    accent: '#22C55E',       // Keep same green
    background: '#020617',   // Deep dark
    surface: '#0F172A',      // Elevated surface
    text: '#E2E8F0',         // Primary text
    textMuted: '#94A3B8',    // Secondary text
    error: '#EF4444',        // Error states
    warning: '#F59E0B',      // Warning states
    info: '#3B82F6',         // Info states
    border: '#1E293B',       // Borders, dividers
    inputBackground: '#1E293B',
    disabled: '#475569',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
} as const;

export type Theme = typeof theme;
export type ColorScheme = 'light' | 'dark';
