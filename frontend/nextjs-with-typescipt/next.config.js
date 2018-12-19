const withTypescript = require("@zeit/next-typescript");
const withCss = require("@zeit/next-css");

// fix: prevents error when .css files are required by node
if (typeof require !== "undefined") {
  require.extensions[".css"] = file => {};
}

const wcss = withCss({
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: "empty"
    };

    return config;
  }
});
module.exports = withTypescript({ ...wcss });
