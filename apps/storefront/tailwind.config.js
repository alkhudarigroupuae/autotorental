/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: '#2563EB',
        'blue-dark': '#1D4ED8',
        'blue-light': '#60A5FA',
        dark: '#1A1A2E',
        'dark-light': '#2D2D44',
      },
      fontFamily: {
        sans: ['Inter', 'Tajawal', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
