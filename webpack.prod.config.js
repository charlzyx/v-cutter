var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HOST = '';
module.exports = {
    entry:{
        app: ['./src/app.js'],
        vux: ['vux']
    },
    output:{
        path: './dist',
        publicPath: HOST + 'dist/',
        filename:'js/[name].build.[hash].js',
        chunkFilename: 'js/[name].chunks.[hash].js'    
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
            // css导出为单独文件
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
        }, {
            // less 文件处理
            test: /\.less$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'less-loader')
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
    vue: {
        loaders: {
            js: 'babel',
            less: ExtractTextPlugin.extract('vue-style-loader', 'css-loader!less-loader'),
            css: ExtractTextPlugin.extract('vue-style-loader', 'css-loader')
        }
    },
    plugins: [
        // 提取公用第三方 js 库
         new webpack.optimize.CommonsChunkPlugin({
            name: ['vux'], // 将公共模块提取，生成名为`vux`bundle
            minChunks: Infinity // 提取至少*个模块共有的部分
        }),
        new ExtractTextPlugin('css/[name].css?[hash]', {
            allChunks: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            // sourceMap: false, 
            // mangle: true
        }),
        new HtmlWebpackPlugin({
            title: 'Vue.js',
            filename: '../index.html',
            template: './src/template/app.html',
            inject: true
        })
    ]
}