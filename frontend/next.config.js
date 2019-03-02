const withTypescript = require('@zeit/next-typescript');
const withCss = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const withSass = require('@zeit/next-sass');
const withSize = require('next-size');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const lessToJS = require('less-vars-to-js');
const { parsed: localEnv } = require('dotenv').config({
  path: path.join(__dirname, '/../.env')
});

const themeVariables = lessToJS(
  fs.readFileSync(path.join(__dirname, './assets/antd-custom.less'), 'utf8')
);

// fix: prevents error when .css or .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {};
  require.extensions['.less'] = file => {};
}

module.exports = withSize(
  withLess(
    withSass(
      withTypescript(
        withCss({
          webpack: config => {
            // Fixes npm packages that depend on `fs` module
            config.node = {
              fs: 'empty'
            };
            config.plugins.push(new webpack.EnvironmentPlugin(localEnv));

            return config;
          },
          lessLoaderOptions: {
            javascriptEnabled: true,
            modifyVars: themeVariables
          },
          env: {
            THEME_VARIABLES: themeVariables
          }
        })
      )
    )
  )
);
