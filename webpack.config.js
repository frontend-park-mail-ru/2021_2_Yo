const path = require('path')
require('dotenv').config();
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

function getDotEnvPlugin(mode) {
    if (mode === 'development') {
        const Dotenv = require('dotenv-webpack');
        return new Dotenv();
    } 
    const options = {
        'process.env': {
            'MAPS_API_KEY': JSON.stringify(process.env.MAPS_API_KEY),
        }
    };
    return new webpack.DefinePlugin(options);
}

module.exports = (env, argv) => {
    return {
        context: path.resolve(__dirname, 'public'),
        mode: 'development',
        entry: {
            bundle: './main.ts',
            sw: './sw.ts'
        },
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
                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                },
            ],
        },
        optimization: {
            splitChunks: {
                chunks: 'all'
            },
            minimizer: [
                new CssMinimizerPlugin(),
            ],
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: (pathData) => {
                return pathData.chunk.name === 'bundle' ? '[name].[contenthash].js' : '[name].js';
            },
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './index.html',
                inject: 'body',
            }),
            new CleanWebpackPlugin(),
            new ESLintPlugin({
                extensions: ['.js', '.ts'],
                fix: true,
            }),
            new MiniCssExtractPlugin(),
            new getDotEnvPlugin(argv.mode),
        ],
        resolve: {
            plugins: [new TsconfigPathsPlugin()],
            extensions: ['.js', '.ts']
        }
    }
}
