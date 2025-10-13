/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      // ============================================
      // V3 COLOR PALETTE - Teal Primary
      // ============================================
      colors: {
        // Primary Teal - Professional, Modern, Enterprise
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },

        // Neutral Grays
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },

        // Status Colors
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          600: '#059669',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          600: '#dc2626',
        },
        warning: {
          50: '#fefce8',
          100: '#fef9c3',
          500: '#eab308',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#2563eb',
        },
      },

      // ============================================
      // TYPOGRAPHY
      // ============================================
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },

      fontSize: {
        'xs': '0.75rem',      // 12px
        'sm': '0.875rem',     // 14px
        'base': '1rem',       // 16px
        'lg': '1.125rem',     // 18px
        'xl': '1.25rem',      // 20px
        '2xl': '1.5rem',      // 24px
        '3xl': '1.875rem',    // 30px
        '4xl': '2.25rem',     // 36px
        '5xl': '3rem',        // 48px
        '6xl': '3.75rem',     // 60px
        '7xl': '4.5rem',      // 72px
      },

      lineHeight: {
        'tight': '1.2',
        'snug': '1.3',
        'normal': '1.5',
        'relaxed': '1.6',
      },

      // ============================================
      // SPACING (8px Base Grid)
      // ============================================
      spacing: {
        '128': '32rem',  // 512px
        '144': '36rem',  // 576px
      },

      // ============================================
      // BOX SHADOWS
      // ============================================
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'glass': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        'sm': '0.25rem',   // 4px
        'DEFAULT': '0.5rem',    // 8px
        'md': '0.5rem',    // 8px
        'lg': '0.75rem',   // 12px
        'xl': '1rem',      // 16px
      },

      // ============================================
      // MAX WIDTH
      // ============================================
      maxWidth: {
        '7xl': '80rem',    // 1280px - Content max width
        '8xl': '90rem',    // 1440px - Full bleed sections
      },

      // ============================================
      // ANIMATIONS
      // ============================================
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
