const path = require("path");

module.exports = {
  target: "node",
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "build.js",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-syntax-dynamic-import"],
          },
        },
      },
    ],
  },
  stats: {
    errorDetails: true,
  },
  externals: {
    bcrypt: "bcrypt",
  },
};
