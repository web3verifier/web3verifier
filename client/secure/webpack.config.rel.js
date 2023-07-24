const path    = require('path');
const fs      = require('fs');
const webpack = require('webpack');

module.exports = {
    mode  : 'production',
    entry : './src/Main.tsx',
    output: {
        path: path.join(__dirname,'dist'),
        filename: 'secure_v0.8.js',
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
            type: 'http'
        },
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 8100,
    },
    resolve: {
        symlinks: false,
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


