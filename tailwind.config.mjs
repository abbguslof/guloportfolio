/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tui: {
          bg: '#0d1117',
          surface: '#161b22',
          surfaceHover: '#1f242c',
          border: '#30363d',
          borderLight: '#484f58',
          text: '#e6edf3',
          muted: '#8b949e',
          green: '#2ea043',
          emerald: '#10b981',
          amber: '#f59e0b',
          cyan: '#38bdf8',
          purple: '#a78bfa',
          red: '#f85149',
        },
      },
      fontFamily: {
        mono: [
          'JetBrains Mono',
          'Geist Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
        sans: [
          'Inter',
          'Geist',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
