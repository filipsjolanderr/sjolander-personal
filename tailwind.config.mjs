import { defineConfig } from 'tailwindcss'

/** @type {import('tailwindcss').Config} */
export default defineConfig({
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
})
