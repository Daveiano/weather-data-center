module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/main/index.ts",
  // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
  // target: 'electron-renderer',
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", "scss", "sass", ".json"],
  },
};
