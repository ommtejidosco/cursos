const path = require('path');

module.exports = {
    entry: './jws.js',
    output: {
        filename: 'jws.min.js',
        path: path.resolve(__dirname, 'resources/core/js'),
    },
    mode: 'production',
    optimization: {
        usedExports: true,
    },
};