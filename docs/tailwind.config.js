module.exports = {
  // This is a bit nasty but ensures that everything works also in the gh-actions environment where the config lies
  // in the root.
  content: ["./**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [require('tailwind-container-break-out')],
  mode: process.env.NODE_ENV && 'jit',
}
