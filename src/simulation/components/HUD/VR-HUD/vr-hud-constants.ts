export const GOLDEN_RATIO = 1.618;
export const PRECISION = 0.1;

export const colors = Object.freeze({
  // background: '#09090b',
  background: '#4b5563', // gray600
  foreground: '#ffffff', // white
  textGray: '#9ca3af',
  background2: '#374151',

  icon: {
    fg: {
      base: '#ffffff', // white
      hover: '#d1d5db',
      disabled: '#d1d5db',
    },
    bg: {
      base: '#6b7280',
      hover: '#4b5563',
      disabled: '#9ca3af',
    },
  },

  // border: '#2a2a2a',
  border: '#6b7280', // gray500
  input: '#282829',

  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563', // decent
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
});

export const SCALE_FACTOR = 0.01;

export const text = {
  xxs: 2 * SCALE_FACTOR,
  xs: 4 * SCALE_FACTOR,
  sm: 6 * SCALE_FACTOR,
  md: 8 * SCALE_FACTOR,
  base: 12 * SCALE_FACTOR,
  lg: 16 * SCALE_FACTOR,
  xl: 20 * SCALE_FACTOR,
  xxl: 24 * SCALE_FACTOR,
} as const;

export const borderRadius = Object.freeze({
  xxs: 6 * SCALE_FACTOR,
  xs: 8 * SCALE_FACTOR,
  sm: 12 * SCALE_FACTOR,
  md: 16 * SCALE_FACTOR,
  base: 24 * SCALE_FACTOR,
  lg: 36 * SCALE_FACTOR,
  xl: 48 * SCALE_FACTOR,
  xxl: 64 * SCALE_FACTOR,
});

export const border = Object.freeze({
  sm: 1 * SCALE_FACTOR,
  md: 2 * SCALE_FACTOR,
  base: 4 * SCALE_FACTOR,
  lg: 6 * SCALE_FACTOR,
  xl: 8 * SCALE_FACTOR,
});

export const depth = {
  xxs: 1 * SCALE_FACTOR,
  xs: 2 * SCALE_FACTOR,
  sm: 3 * SCALE_FACTOR,
  md: 4 * SCALE_FACTOR,
  base: 5 * SCALE_FACTOR,
  lg: 6 * SCALE_FACTOR,
  xl: 7 * SCALE_FACTOR,
  xxl: 8 * SCALE_FACTOR,
} as const;

export const icons = {
  base: text.sm * 1,
} as const;
