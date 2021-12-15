const path = require("path");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
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
    // new CleanWebpackPlugin({
    //   cleanAfterEveryBuildPatterns: ["dist"],
    // }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.PORT": JSON.stringify(process.env.PORT),
      "process.env.DB_HOST": JSON.stringify(process.env.DB_HOST),
      "process.env.DB_USER": JSON.stringify(process.env.DB_USER),
      "process.env.DB_PASSWORD": JSON.stringify(process.env.DB_PASSWORD),
      "process.env.DB_PORT": JSON.stringify(process.env.DB_PORT),
      "process.env.DB_NAME": JSON.stringify(process.env.DB_NAME),
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
      "process.env.JWT_SECRET_KEY": JSON.stringify(process.env.JWT_SECRET_KEY),
    }),
  ],
  stats: {
    errorDetails: true,
  },
};
