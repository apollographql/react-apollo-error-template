const {
  override,
  addWebpackPlugin,
} = require("customize-cra");

const webpack = require("webpack");

module.exports = override(
  addWebpackPlugin(
    new webpack.DefinePlugin({
      __DEV__: process.env.NODE_ENV !== "production",
    }),
  ),
);
