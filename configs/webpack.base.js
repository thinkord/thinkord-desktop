const webpack = require('webpack');

module.exports = {
    entry: {
        polyfill: '@babel/polyfill',
    },
    resolve: {
        extensions: [".ts",".jsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-react'
                        ]
                    }
                }
            },
            {
                test: /\.ts$/,
                include: /app/,
                use: [{ loader: 'ts-loader' }]
            },
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                }
            },
            {
                test: /\.html$/,
                use: "html-loader"
            },
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(jpe?g|png|svg)$/,
                use: 'file-loader?name=asset/[name].[ext]'
            }
        ]
    },
    externals: ['pg', 'tedious', 'pg-hstore']
}
