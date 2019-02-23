const path = require('path');

module.exports = {
    entry: {
        app: './src/index.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
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
        ]
    },

    devServer: {
        // enable live reloading
        contentBase: path.resolve(__dirname, 'dist'),
        watchContentBase: true,
        compress: true,
        port: 8080
    }
};