const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { spawn } = require('child_process')

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const defaultInclude = path.resolve(__dirname, 'src')

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: [{ loader: 'babel-loader'}],
                //include: defaultInclude
            },
            {
                // We need css-loader module to resolve css files.
                // We also need a style-loader to inject this into our DOM — adding a <style> tag 
                // into the <head> element of our HTML.
                test: /\.css$/,                
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
                //include: defaultInclude
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
                //include: defaultInclude
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
                //include: defaultInclude
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    devtool: 'cheap-source-map',
    devServer: {        
        contentBase: path.resolve(__dirname, 'dist'),
        stats: {
            colors: true,
            chunks: false,
            children: false
        },
        before() {
            spawn(
            'electron',
            ['.'],
            { shell: true, env: process.env, stdio: 'inherit' }
            )
            .on('close', code => process.exit(0))
            .on('error', spawnError => console.error(spawnError))
        }
    }
}