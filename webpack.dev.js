const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',

    devtool: 'inline-source-map',

    devServer: {
        // enable live reloading
        contentBase: path.resolve(__dirname, 'dist'),
        watchContentBase: true,
        compress: true,
        port: 8080,
    }
});