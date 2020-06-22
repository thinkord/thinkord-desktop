/**
 * Webpack config for development electron main process
 */

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.main.js');

module.exports = merge.smart(baseConfig, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: 'main-dev.js'
      },
});