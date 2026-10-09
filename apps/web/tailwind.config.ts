import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: { colors: { ink: '#102a43', mist: '#f0f4f8', coral: '#d64545', mint: '#2f855a' } },
  },
  plugins: [],
} satisfies Config;
