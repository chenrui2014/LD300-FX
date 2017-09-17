/**
 * Created by chen on 17-8-25.
 */
const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'src');

module.exports = {
    entry:{
        vendor:['react','react-dom'],
        app: [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            path.resolve(APP_PATH, "index.js")
        ]
    },
    output: {
        path: path.resolve(ROOT_PATH, "public"),
        filename: '[name].[hash].js'
    },
    devtool:"source-map",
    devServer: {
        hot: true,  // 热重载
        inline: true,  // 启用inline 模式
        port: 8080,
        contentBase: path.resolve(ROOT_PATH, "dist"),
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                secure: false,  // 处理https
                changeOrigin: true,   // 跨域
            }
        }
    },
    resolve: {
        extensions: [' ', '.js', '.jsx']
    },
    module: {
        rules:  [{
            test: /.js[x]?$/,
            use: ["react-hot-loader",
                'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0'
            ],
            exclude: path.resolve(ROOT_PATH,'node_modules'),
            include: APP_PATH
        },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader"
                    ]
                })
            },
            {
                test: /\.(gif|png|bmp|jpe?g)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "static/img/[name].[ext]"
                    }
                }]
            },
            {
                test: /\.(ttf|eot|svg|woff)(\?(\w|#)*)?$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "static/font/[name].[ext]"
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlwebpackPlugin({
            template: path.resolve(ROOT_PATH, "templates/index.html"),
            name: "index",
            title: "webpack config cli",
            filename: "index.html",
            inject: true,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js'
        }),
        new ExtractTextPlugin({
            filename: "css/index.css"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}