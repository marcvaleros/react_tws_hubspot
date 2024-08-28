/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'hs-font': ['Lexend Deca', 'Helvetica', 'Arial', 'sans-serif'],
      },
      
      colors: {
        'hs-background': '#fefefe', 
        'hs-gray': '#dde2e5', 
        'hs-light-gray': '#425B76', 
        'hs-dark-gray': '#2D3E50', 
        'hs-orange': '#F87759', 
        'hs-orange-light': '#FF8F73', 
        'hs-black': '#000000', 
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

