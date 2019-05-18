const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  pages: {
    // main site entry point
    site: {
      entry: 'src/main.js',
      filename: 'index.html',
      title: 'Thlicing Pie',
    },
  },

  configureWebpack(config) {
    // copy netlify CMS uploads into public folder
  },

  chainWebpack: (config) => {
    // enable eslint "fix" mode -- fixes spaces, trailing commas, etc
    config.module.rule('eslint').use('eslint-loader').options({
      fix: true
    });

    config.module.rule('ico').test(/\.(ico)(\?.*)?$/)
      .use('file-loader').loader('file-loader')
      .end();

    // make some global variables always accessible using sass-resources-loader
    // see https://www.npmjs.com/package/sass-resources-loader#vuejs-webpack-templatevue-cli3
    const oneOfsMap = config.module.rule('less').oneOfs.store;
    oneOfsMap.forEach((item) => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Or array of paths
          resources: [
            './src/assets/style/_variables.less',
            './src/assets/style/_colors.less',
          ],
        })
        .end();
    });

    // turn off splitChunks optimization
    // TODO: maybe enable vendor chunk for front-end?
    // need to make sure the admin stuff stays separated
    config.optimization.splitChunks(false);
  },
}
