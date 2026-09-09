import colors from 'tailwindcss/colors'
import { success } from 'zod';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.gray[800],
        'primary-hover': colors.black,
        'on-primary': colors.white,
        background: colors.slate[100],
        surface: colors.white,
        heading: colors.slate[800],
        body: colors.slate[500],
        label: colors.slate[700],
        border: colors.slate[300],
        focus: colors.zinc[300],
        'focus-soft': colors.gray[300],
        error: colors.red[400],
        'shadow-soft': colors.gray[200],
        success: colors.green[200],
        warning: colors.orange[200],
        info: colors.blue[200]
      },
    },
  },
  plugins: [],
}

