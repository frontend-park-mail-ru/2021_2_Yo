const path = require('path')

module.exports = {
    context: path.resolve(__dirname, 'public'),
    mode: 'development',
    entry: './main.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
          {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    }
}
