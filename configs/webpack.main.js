/**
 * Webpack config for electron main process
 */

const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const path = require('path');

module.exports = merge.smart(baseConfig, {
    target: 'electron-main',
    entry: './app/main-dev.ts',
    module: {
        rules: [{
            test: /\.ts$/,
            include: /app/,
            use: [{ loader: 'ts-loader' }]
        }]
    },
    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    node: {
        __dirname: false,
        __filename: false
    }
});