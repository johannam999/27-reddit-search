'use strict';

// only development environment
// test removing some the see what changes
const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

const { HotModuleReplacementPlugin } = require('webpack'); 

const webpackDevConfig = {};

webpackDevConfig.mode = 'development';
webpackDevConfig.devtool = 'inline-source-map'; 

webpackDevConfig.devServer = {
  contentBase: './build', // tells server where to serve content from
  open: true, // open new tab in browser
  hot: true, // if changes to file it reloads instantly with HotMR
  historyApiFallback: true, 
};

webpackDevConfig.plugins = [
  new HotModuleReplacementPlugin(),
];

webpackDevConfig.module = {};
webpackDevConfig.module.rules = [
  {
    test: /\.scss$/,
    use: [ // this order is important!! start from bottom to top
      'style-loader', // compiles into the page, adds tag into html page
      'css-loader', // compiles into regular string
      'sass-loader', // looks at css file and compiles into readable css
    ],
  },
];

module.exports = merge(commonConfig, webpackDevConfig); // serves npm run watch
