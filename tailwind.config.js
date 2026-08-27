/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cr: {
          bg: '#F8FAFC',        // Slate 50 - softer background
          surface: '#FFFFFF',
          text: '#334155',      // Slate 700 - gentler text
          muted: '#94A3B8',     // Slate 400 - softer muted text
          red: '#F47174',       // Soft coral instead of harsh red
          'red-dark': '#E05A5D',// Slightly deeper coral
          yellow: '#FDE047',    // Pastel yellow
          gray: '#F1F5F9',      // Slate 100 - soft highlights
          border: '#E2E8F0',    // Slate 200 - softer borders
          card: '#FFFFFF',
          dark: '#1E293B',      // Slate 800 - softer dark mode tone
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Manrope', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
        display: ['"Plus Jakarta Sans"', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 4px -1px rgba(0, 0, 0, 0.02), 0 1px 2px -1px rgba(0, 0, 0, 0.01)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -4px rgba(0, 0, 0, 0.02)',
        'floating': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
      },
      letterSpacing: {
        'tighter-editorial': '-0.03em',
        'tight-editorial': '-0.02em',
      }
    },
  },
  plugins: [],
}
