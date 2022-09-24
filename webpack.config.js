const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        main: './local/index.js',
        frame: './local/frame/frame.js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'local', 'dist'),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'local'),
        },
        compress: true,
        port: 9000,
        open: true,
    },
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({ inject: true, template: './local/index.html' }),
        new HtmlWebpackPlugin({ filename: 'frame/frame.html', inject: true, template: './local/frame/frame.html' }),
    ],
};
