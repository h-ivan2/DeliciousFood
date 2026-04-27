/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:'class',
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors:{
        accent: '#F5B301',
        'accent-dark':'#c98f00',
        'dark-bg':'#070b14',
        'dark-card':'#0b1020',
        'dark-border':'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        display:['Playfair Display','serif'],
        body:['DM Sans','sans-serif'],
      },
      animation: {
        float:'float 4s ease-in-out infinite',
        'fade-up':'fadeUp 0.7s ease forwards',
        'fade-in':'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        float:{
          '0%, 100%':{ transform:'translateY(0)' },
          '50%': { transform:'translateY(-12px)'},
      },
        fadeUp:{
          from: {opacity:'0',transform:'translateY(28px)'},
          to: { opacity: '1',transform: 'translateY(0)'},
        },
        fadeIn: {
          from: {opacity: '0'},
          to:{opacity:'1'},
        },
    },
  },
},
plugins:[],
}