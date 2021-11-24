const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env",
});

module.exports = {
  target: "node",
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "build.js",
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["dist"],
    }),
    new webpack.DefinePlugin({
      "process.env.HOST": JSON.stringify(process.env.HOST),
      "process.env.DB_USER": JSON.stringify(process.env.DB_USER),
      "process.env.PASSWORD": JSON.stringify(process.env.PASSWORD),
      "process.env.DATABASE_NAME": JSON.stringify(process.env.DATABASE_NAME),
      "process.env.TYPE": JSON.stringify(process.env.TYPE),
      "process.env.PROJECT_ID": JSON.stringify(process.env.PROJECT_ID),
      "process.env.PRIVATE_KEY": JSON.stringify(process.env.PRIVATE_KEY),
      "process.env.CLIENT_EMAIL": JSON.stringify(process.env.CLIENT_EMAIL),
      "process.env.CLIENT_ID": JSON.stringify(process.env.CLIENT_ID),
      "process.env.AUTH_URI": JSON.stringify(process.env.AUTH_URI),
      "process.env.TOKEN_URI": JSON.stringify(process.env.TOKEN_URI),
      "process.env.AUTH_PROVIDER_X509_CERT_URI": JSON.stringify(
        process.env.AUTH_PROVIDER_X509_CERT_URI
      ),
      "process.env.CLIENT_X509_CERT_URI": JSON.stringify(
        process.env.CLIENT_X509_CERT_URI
      ),
    }),
  ],
  stats: {
    errorDetails: true,
  },
};
