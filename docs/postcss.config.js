module.exports = {
  syntax: require('postcss-scss'),
  parser: require('postcss-scss'),
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('postcss-import')({
      path: ['_sass', 'node_modules']
    }),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('tailwindcss')('./tailwind.config.js'),
    require('autoprefixer'),
  ]
}