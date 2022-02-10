module.exports = {
  darkMode: 'class',
  theme: {
    variants: {
      extend: {
        typography: ['dark']
      }
    },
  },
  // This is a bit nasty but ensures that everything works also in the gh-actions environment where the config lies
  // in the root.
  content: ["./**/*.html"],
  plugins: [
    require('tailwind-container-break-out'),
    require('@tailwindcss/typography'),
  ],
}
