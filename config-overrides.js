const {
  override,
  addWebpackPlugin,
} = require("customize-cra");

const webpack = require("webpack");

module.exports = override(
  addWebpackPlugin(
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(false),
    }),
  ),
);
