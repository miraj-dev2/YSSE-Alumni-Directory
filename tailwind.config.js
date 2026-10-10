/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        ground: '#18251D',
        sidebar: '#131E17',
        card: '#1F3027',
        'table-header': '#26382E',
        'icon-circle': '#2A4033',
        lines: '#2E4336',
        pending: {
          DEFAULT: '#E9C46A',
          bg: '#3D3619',
        },
        destructive: {
          DEFAULT: '#E8A598',
          bg: 'rgba(232, 165, 152, 0.12)',
        },
        surface: {
          DEFAULT: '#1F3027',
          hover: '#263A30',
          active: '#2D4438',
        },
        border: {
          DEFAULT: '#2E4336',
          strong: '#3B5244',
        },
        text: '#EEF3E8',
        muted: '#9DB0A2',
        accent: {
          DEFAULT: '#B7FF72',
          hover: '#A3F558',
          active: '#91E045',
        },
        'on-accent': '#18251D',
        status: {
          pending: '#E9C46A',
          'pending-bg': '#3D3619',
          approved: '#B7FF72',
          'approved-bg': 'rgba(183, 255, 114, 0.12)',
          rejected: '#E8A598',
          'rejected-bg': 'rgba(232, 165, 152, 0.12)',
          done: '#6C9BCF',
          'done-bg': 'rgba(108, 155, 207, 0.12)',
        },
      },
      fontFamily: {
        heading: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'admin-card': '22px',
        chip: '999px',
      },
    },
  },
  plugins: [],
}
