const path = require('path');

module.exports = {
  mode: "development",
  entry: "./dist/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "umd"),
    library: {
      name: "lugath-javascript-sdk",
      type: "umd"
    }
  },
  resolve: {
    fallback: {
      https: false,
      fs: false
    }
  }
};