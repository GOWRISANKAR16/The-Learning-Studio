/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        card: '0 4px 12px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        xl: '0.9rem',
      },
    },
  },
  plugins: [],
}


