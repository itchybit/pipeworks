(function() {
  'use strict';

  var webpack = require('webpack');
  var path = require('path');
  var HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    devtool: 'eval-source-map',
    entry: [
      'webpack-hot-middleware/client?reload=true',
      path.join(__dirname, 'app/main.jsx')
    ],
    output: {
      path: path.join(__dirname, 'server/dist'),
      filename: '[name].js',
      publicPath: '/'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'app/index.tpl.html',
        inject: 'body',
        filename: 'index.html'
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ],
    module: {
      loaders: [{
        test: /.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },{
        test: /.mp3$/,
        exclude: /node_modules/,
        loader: 'file-loader',
      },{
        test: /\.glsl$/,
        loader: 'webpack-glsl'
      },{
        test: /\.obj$/,
        loader: 'raw-loader'
      }]
    }
  }
})();
