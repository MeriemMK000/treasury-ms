import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eef5ff', 100: '#d9e8ff', 200: '#bcd7ff', 300: '#8ebfff', 400: '#599cff', 500: '#3478f6', 600: '#1e5aeb', 700: '#1646d8', 800: '#1839af', 900: '#1a348a', DEFAULT: '#1e5aeb' },
        accent: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', DEFAULT: '#22c55e' },
        danger: { 50: '#fef2f2', 500: '#ef4444', 600: '#dc2626', DEFAULT: '#ef4444' },
        warning: { 50: '#fffbeb', 500: '#f59e0b', DEFAULT: '#f59e0b' },
        surface: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'glow': '0 0 20px rgba(30,90,235,0.15)',
      },
    },
  },
  plugins: [],
};
export default config;
