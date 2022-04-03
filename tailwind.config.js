module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend:{
      fontFamily: {
        sevillana: "'sevillana', serif",
      },
      flex: {
        '1': '1 1 0%',
        auto: '1 1 auto',
        initial: '0 1 auto',
        inherit: 'inherit',
        none: 'none',
        '2': '2 2 0%',
      }
    },
   
  },
  variants: {
    extend: {
      cursor: ['hover', 'focus'],
    },
  },
  plugins: [],
}
