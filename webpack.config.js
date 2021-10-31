const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

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
          {
            test: /\.hbs$/,
            use: 'handlebars-loader',
          },
        ],
    },
    resolve: {
        extensions: [ '.js', '.ts' ],
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body',
        }),
        new CleanWebpackPlugin(),
        new ESLintPlugin({extensions: ['.js', '.ts']}),
    ],
    resolve: {
      plugins: [ new TsconfigPathsPlugin() ],
      extensions: ['.js', '.ts']
    }
}
