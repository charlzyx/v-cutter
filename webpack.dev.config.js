var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HOST = '';

module.exports = {
    devtool: '#source-map',
    entry:{
        app: './src/app.js'
    },
    output:{
        path: './dist',
        publicPath: HOST + 'dist/',
        filename:'js/[name].js',
        chunkFilename: 'js/[name].chunks.js'    
    },
      module: {
        loaders: [{
            // js使用ES6语法
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
        }, {
            test: /\.vue$/,
            loader: 'vue'
        }, {
            // vux
            test: /vux.src.*?js$/,
            loader: 'babel'
        }, {
            // 导入独立 json 数据
            test: /\.json$/,
            loader: 'json'
        }, {
            // 图片处理
            test: /\.(png|jpg|gif)$/,
            loader: 'url',
            query: {
                // inline files smaller then 8kb as base64 dataURL
                limit: 819200,
                // fallback to file-loader with this naming scheme
                name: 'img/[name].[ext]'
            }
        }, {
            // css文件处理
            test: /\.css$/,
            loader: ['style', 'css']
        }, {
            // less 文件处理
            test: /\.less$/,
            loader: ['style', 'css', 'less']
        }, {
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader?name=./fonts/[name].[ext]'
        }, {
            //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
            //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
            test: /\.html$/,
            loader: "html?attrs=img:src img:data-src"
        }]
    },
    resolve: {
        // 可省略的后缀名,个人不建议缩略,后缀名可判断来源
        extensions: ['', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Vue.js',
            filename: '../index.html',
            template: './src/template/app.html',
            inject: true
        })
    ]
}