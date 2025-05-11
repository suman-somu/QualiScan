/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0A0A0A',
        secondary: '#1A1A1A',
        secondaryLight: '#2E2E2E',
        accent: '#FAFAFA',
        highlight: '#F0F0F0',
        background: '#FFFFFF',
        surface: '#F7F7F7',
        textPrimary: '#0A0A0A',
        textSecondary: '#4B4B4B',
        border: '#D4D4D4',
        button: '#000000',
        buttonHover: '#1A1A1A',
        disabled: '#B0B0B0',
      },
    },
  },
  plugins: [],
}
