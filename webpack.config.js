const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js',
        'dist-dependencies': ['phaser']
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src/'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ],
    },

    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'assets', '**', '*'),
                to: path.resolve(__dirname, 'dist')
            },
        ]),

        new webpack.optimize.SplitChunksPlugin({
            name: 'dist-dependencies',
            filename: 'dist-dependencies.bundle.js'
        }),

        // taken from a tutorial. But seems to work without it for now
        // new webpack.DefinePlugin({
        //     'typeof CANVAS_RENDERER': JSON.stringify(true),
        //     'typeof WEBGL_RENDERER': JSON.stringify(true)
        //  })
    ],

    devServer: {
        // enable live reloading
        contentBase: path.resolve(__dirname, 'dist'),
        watchContentBase: true,
        compress: true,
        port: 8080,
    },
};