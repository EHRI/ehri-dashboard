/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
   content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
      colors: {
        'ehri-purple': '#472c57',
        'ehri-wine': '#83004c',
        'ehri-dark': '#3b3b34',
        'ehri-beige': '#dbd7bd',
        'ehri-light-grey': '#f2f2f2',
        'white': '#ffffff',
        'black': '#000000'
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'sans-serif'],
        serif: ['"Barlow"', 'serif'],
      },
      container: {
        padding: "2rem",
        center: true,
      },
      extend: {
        opacity: {
          '85': '0.85',
          '80': '0.80',
          '30': '0.30'
        },
        height: {
          'scroll': '30rem'
        }
      },
    },
    variants: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/line-clamp'),
    ],
  }