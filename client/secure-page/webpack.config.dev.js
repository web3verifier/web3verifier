const path    = require('path');
const fs      = require('fs');
const webpack = require('webpack');

module.exports = {
    mode  : 'development',
    devtool: 'inline-source-map',
    entry : './src/Main.tsx',
    output: {
        path: path.join(__dirname,'dist'),
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { presets: ['@babel/preset-env', '@babel/react'] },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(__dirname, 'tsconfig.json'),
                            allowTsInNodeModules: true,
                        },
                    },
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
                    },
                ]
            },
        ],
    },
    devServer: {
        server: {
            type: 'https',
            options: {
                key: fs.readFileSync( './ssl/key.pem' ),
                cert: fs.readFileSync( './ssl/cert.pem' ),
            },
        },
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 4333,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json' ],
        fallback: {
            buffer: require.resolve('buffer/'),
        },
    },
    target: 'web',
    plugins: [
        new webpack.ProvidePlugin({
              Buffer: ['buffer', 'Buffer']
        })
    ],
};


