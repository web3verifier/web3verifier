const path = require('path');
const fs   = require('fs');

module.exports = {
    mode  : 'production',
    entry : './src/Verify.tsx',
    output: {
        path: path.join(__dirname,'dist'),
        filename: 'verify.js',
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
        headers: {
            //"Access-Control-Allow-Origin": "*",
            //"Access-Control-Allow-Methods": "*",
            //"Access-Control-Allow-Headers": "*",
            //"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            //"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        port: 4333,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json' ],
    },
    target: 'web',
};


