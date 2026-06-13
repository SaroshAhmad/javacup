/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Blue — Brand Identity §3.1
        brand: {
          50:      '#EEF1FC',
          100:     '#DDE3FC',
          200:     '#C7D0FA',
          300:     '#93A4F4',
          400:     '#5A78E8',
          DEFAULT: '#3B5BDB',  // brand-500
          700:     '#2D4AC7',
          900:     '#1A2F8A',
          950:     '#0D1B5E',
          // Aliases kept for convenience
          light:   '#EEF1FC',
          dark:    '#1A2F8A',
        },
        // Amber (coffee accent) — §3.2
        amber: {
          100: '#FEF3C7',
          300: '#FCD34D',
          500: '#F59E0B',
          700: '#B45309',
          900: '#78350F',
        },
        // Cool slate neutrals — §3.3
        neutral: {
          50:  '#F9FAFB',
          100: '#F8FAFC',
          200: '#F1F5F9',
          300: '#E2E8F0',
          400: '#CBD5E1',
          500: '#94A3B8',
          600: '#64748B',
          700: '#475569',
          800: '#334155',
          900: '#1E293B',
          950: '#0F172A',
        },
        // Semantic — §3.4
        success: {
          DEFAULT: '#10B981',
          bg:      '#D1FAE5',
          dark:    '#065F46',
          light:   '#D1FAE5',
        },
        warning: {
          dark:  '#78350F',
          light: '#FEF3C7',
        },
        error: {
          DEFAULT: '#EF4444',
          bg:      '#FEE2E2',
          dark:    '#991B1B',
          light:   '#FEE2E2',
        },
      },

      fontFamily: {
        // §4.1 — Plus Jakarta Sans for display/headings, Inter for body
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      spacing: {
        // §5.1 custom values on top of Tailwind defaults
        '18':  '4.5rem',
        '88':  '22rem',
        '128': '32rem',
      },

      borderRadius: {
        // §6.1
        sm:   '4px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
        '2xl':'24px',
      },

      boxShadow: {
        // §6.2
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },

      keyframes: {
        // §6.3 motion tokens
        dropdown: {
          from: { opacity: '0', transform: 'translateY(-4px) scale(0.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fade: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
      },

      animation: {
        dropdown:      'dropdown 150ms ease-out',
        fade:          'fade 200ms ease-out',
        'slide-in-left': 'slideInLeft 200ms ease-out',
      },
    },
  },
  plugins: [],
};
