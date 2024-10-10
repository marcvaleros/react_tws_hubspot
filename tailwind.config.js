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
        'hs-blue': '#0091AE',
        'hs-dark-blue': '#007689',
        'hs-background': '#fefefe', 
        'hs-gray': '#dde2e5', 
        'hs-light-gray': '#425B76', 
        'hs-dark-gray': '#2D3E50', 
        'hs-orange': '#F87759', 
        'hs-orange-light': '#FF8F73', 
        'hs-black': '#000000', 
        'hs-green': '#24bb24', 
      },
      keyframes: {
        bounceCustom: {
          '0%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-50%)', // Adjust this value for bounce height
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
      },
      animation:{
        'spin-slow': 'spin 3s linear infinite',
        'bounce-custom-slow': 'bounceCustom 3s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

