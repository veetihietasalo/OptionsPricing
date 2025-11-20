/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Original theme
        'dark-bg': '#0a0a0f',
        'dark-card': '#1a1a2e',
        'dark-elevated': '#25253f',
        'accent-purple': '#a855f7',
        'accent-cyan': '#06b6d4',

        // Bloomberg Professional Theme
        'bbg-orange': '#FF6600',
        'bbg-dark': '#0A0A0A',
        'bbg-gray': '#1A1A1A',
        'bbg-panel': '#2A2A2A',
        'bbg-text': '#FFFFFF',
        'bbg-accent': '#FFB84D',
        'bbg-green': '#00FF00',
        'bbg-red': '#FF0000',
        'bbg-blue': '#00BFFF',
      },
      fontFamily: {
        'bloomberg': ['Monaco', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        'gradient-bloomberg': 'linear-gradient(135deg, #FF6600 0%, #FFB84D 100%)',
      },
    },
  },
  plugins: [],
}
