const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js',
        'dist-dependencies': ['phaser']
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].bundle.js'
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

    // splitting chunks based on vendor and application
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                },
                default: {
                    minChunks: 2,
                    reuseExistingChunk: true
                }
            }
        }
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),
        
        new HtmlWebpackPlugin({
            title: 'SimpleSciFiRPG',
            // Load a custom template (lodash by default see the FAQ for details)
            template: './src/index.html',
            hash: true,
            files: {
                css: ['./assets/css/main.css']
            }
        }),

        // copying assets to the distribution folder as well
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'assets', '**', '*'),
                to: path.resolve(__dirname, 'dist')
            },
        ]),

        // cache hashing based on content. If content doesn't change the hash stays the same
        new webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 20
        }),
    ]
};