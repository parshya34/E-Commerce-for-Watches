/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7d7fe',
          300: '#a4bcfc',
          400: '#819af8',
          500: '#6474f1',
          600: '#4f55e2',
          700: '#4242c9',
          800: '#3738a4',
          900: '#323583',
          950: '#1e1e4b',
        },
        secondary: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d9d9de',
          300: '#b8b8c1',
          400: '#9292a0',
          500: '#757584',
          600: '#5f5f6d',
          700: '#4d4d59',
          800: '#42424b',
          900: '#3a3a41',
          950: '#25252b',
        },
        accent: {
          50: '#fcf8f0',
          100: '#f8edda',
          200: '#f0d8b3',
          300: '#e7be85',
          400: '#dea35e',
          500: '#d78a3e',
          600: '#c9732e',
          700: '#a75a27',
          800: '#864826',
          900: '#6c3b22',
          950: '#3b1d0f',
        },
        success: {
          50: '#f0fdf6',
          100: '#dcfce9',
          500: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          700: '#b91c1c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};