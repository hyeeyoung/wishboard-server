module.exports = {
  target: "node",
  entry: "./src/app.js",
  output: {
    path: __dirname + "/dist",
    filename: "build.js",
  },
  //   watch: true,
};
