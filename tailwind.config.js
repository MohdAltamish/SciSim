/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#4A6CF7',
        'brand-dark': '#3A5AE0',
        surface: '#f9f9f7',
        'border-light': '#e8e8e4',
        'chem-bg': '#fff3cd',
        'chem-text': '#7a5500',
        'phys-bg': '#dce8ff',
        'phys-text': '#1a3a8f',
        'bio-bg': '#d4f7e0',
        'bio-text': '#0e5c30',
        'ai-bg': '#ede0ff',
        'ai-text': '#4a0099',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'pill': '99px',
        'card': '24px',
        'chat': '14px',
      },
    },
  },
  plugins: [],
}
