module.exports = {
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("postcss-import")({
      path: ["node_modules"],
    }),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("tailwindcss")("./tailwind.config.js"),
    require("autoprefixer"),
  ],
};
