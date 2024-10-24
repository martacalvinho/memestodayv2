/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
          600: '#4B5563',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
        },
        blue: {
          500: '#3B82F6',
          400: '#60A5FA',
        },
        yellow: {
          500: '#F59E0B',
          400: '#FBBF24',
        }
      }
    },
    container: {
      center: true,
      padding: '1rem',
    }
  },
  plugins: []
}