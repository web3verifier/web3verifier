const path = require('path');
const fs   = require('fs');

module.exports = {
    mode  : 'development',
    devtool: 'inline-source-map',
    entry : './src/VerifyCore.tsx',
    output: {
        path: path.join(__dirname,'dist'),
        filename: 'verify_core_v0.7.js',
    },
    watchOptions: {
        followSymlinks: true,
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
            type: 'http',
        },
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        headers: {
            //"Access-Control-Allow-Origin": "*",
            //"Access-Control-Allow-Methods": "*",
            //"Access-Control-Allow-Headers": "*",
            //"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            //"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        port: 8090,
    },
    resolve: {
        symlinks: false,
        extensions: ['.ts', '.tsx', '.js', '.json' ],
    },
    target: 'web',
};


