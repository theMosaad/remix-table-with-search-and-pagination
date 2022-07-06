const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      minWidth: ({ theme }) => ({
        ...theme('spacing'),
        ...defaultTheme.minWidth,
      }),
    },
  },
  plugins: [],
}
