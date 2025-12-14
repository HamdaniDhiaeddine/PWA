
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: '#2D5F3F',
          light: '#3E7A54',
          dark: '#1F422C',
        },
        jade: {
          DEFAULT: '#4A9B6F',
          light: '#65B588',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#F0EBE0',
        },
        sage: {
          DEFAULT: '#8BA888',
          light: '#A3C1A0',
        },
        forest: {
          DEFAULT: '#1A3A2A',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'organic': '60% 40% 40% 60% / 60% 40% 60% 40%',
        'organic-2': '40% 60% 60% 40% / 40% 60% 40% 60%',
      }
    },
  },
  plugins: [],
}
