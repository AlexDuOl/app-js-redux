/*Creamos un archivo comprimido a partir de un bundle
a partir de los archivos que utilizamos */
let path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: "./app.js",
    mode: "production",
    output: {
        path: path.join(__dirname, "build"),
        filename: "fixter.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ]
};