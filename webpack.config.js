const path = require('path')

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".js", ".json"],
  },

  module: {
    rules: [
      { test: /\.ts?$/, loader: "ts-loader" },

      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: "style-loader",
            options: {
              insert: "head",
              injectType: "singletonStyleTag",
            },
          },

          "css-loader",

          "sass-loader",
        ],
      },
    ],
  },
};
