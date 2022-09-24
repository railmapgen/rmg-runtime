const path = require('path');

module.exports = {
    entry: {
        main: './local/index.js',
        frame: './local/frame/frame.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'local', 'dist')
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'local'),
        },
        compress: true,
        port: 9000,
    },
    mode: 'development'
}
