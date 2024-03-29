module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: "node-loader",
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@marshallofsound/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    test: /(\.scss|\.sass|\.css)$/,
    use: [
      // Creates `style` nodes from JS strings
      "style-loader",
      // Translates CSS into CommonJS
      "css-loader",
      "postcss-loader",
      // Compiles Sass to CSS
      {
        loader: "sass-loader",
        options: {
          sassOptions: {
            includePaths: ["node_modules/@carbon/type"],
          },
        },
      },
    ],
  },
  {
    test: /\.css$/,
    exclude: /(node_modules|\.webpack)/,
    use: ["css-loader"],
  },
];
