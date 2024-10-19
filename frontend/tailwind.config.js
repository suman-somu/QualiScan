/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0d47a1', // Dark Blue
        secondary: '#1565c0', // Medium Blue
        accent: '#42a5f5', // Light Blue
        highlight: '#90caf9', // Very Light Blue
        background: '#e3f2fd', // Light Background
        text: '#0d47a1', // Dark Blue Text
        button: '#1e88e5', // Blue
        buttonHover: '#1565c0', // Darker Blue
      },
    },
  },
  plugins: [],
}