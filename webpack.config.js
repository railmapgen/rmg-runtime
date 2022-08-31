const path = require('path');

module.exports = {
    entry: {
        main: './local/index.js',
        frame: './local/frame.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'local', 'dist')
    },
    mode: 'development'
}
