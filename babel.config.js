module.exports = api => {
  const isTest = api.env('test');

  if (isTest) {
    return {
      "presets": [['@babel/preset-env', { targets: { node: 'current' } }], "@babel/preset-react", "@babel/preset-typescript"],
    };
  }

  return {
    "plugins": ["react-hot-loader/babel", "emotion"]
  };
};