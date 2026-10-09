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
        surface: {
          DEFAULT: 'var(--surface)',
          hover: 'var(--surface-hover)',
          active: 'var(--surface-active)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: '#A3F558',
          active: '#91E045',
        },
        'on-accent': 'var(--on-accent)',
        status: {
          pending: 'var(--status-pending)',
          'pending-bg': 'var(--status-pending-bg)',
          approved: 'var(--status-approved)',
          'approved-bg': 'var(--status-approved-bg)',
          rejected: 'var(--status-rejected)',
          'rejected-bg': 'var(--status-rejected-bg)',
          done: 'var(--status-done)',
          'done-bg': 'var(--status-done-bg)',
        },
      },
      fontFamily: {
        heading: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '1.6'],
        lg: ['18px', '26px'],
        xl: ['24px', '32px'],
        '2xl': ['32px', '40px'],
        '3xl': ['48px', '56px'],
        '4xl': ['64px', '72px'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius-base)',
        sm: '6px',
        md: 'var(--radius-base)',
        lg: 'var(--radius-base)',
        xl: 'var(--radius-base)',
        '2xl': 'var(--radius-base)',
        card: 'var(--radius-base)',
        modal: 'var(--radius-base)',
        full: 'var(--radius-chip)',
        chip: 'var(--radius-chip)',
      },
      maxWidth: {
        content: '1200px',
        admin: '1400px',
      },
      transitionDuration: {
        DEFAULT: '150ms',
        fast: '150ms',
        base: '200ms',
      },
    },
  },
  plugins: [],
}
