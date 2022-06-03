// vue.config.js
const path = require('path');

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
};
