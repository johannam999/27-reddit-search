'use strict';

require('dotenv').config();

const HTMLWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = module.exports = {}; // oldschool style

webpackConfig.entry = `${__dirname}/src/main.js`; // one entry point for application
webpackConfig.output = {// tells where to output of application
  filename: '[name].[hash].js', // name = main.js, generates unique hash is for CDN
  path: `${__dirname}/build`, // we are transpiling, this file is created in memory we dont see it
  publicPath: process.env.CDN_URL, 
  // this is for CDN, defaults to '/'
};

webpackConfig.plugins = [// array takes plugins
  new HTMLWebpackPlugin({// this makes index.html file, title is only an option
    title: 'Pokemon app',
  }),
];

webpackConfig.module = {}; // modules object and adding all the rules below to transpile
webpackConfig.module.rules = [
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
      'file-loader', // array bc we dont need extra configuration as oppose to below options object
    ],
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['env', 'stage-0', 'react'], // babel transpiles it into js file
        plugins: ['transform-react-jsx-source'],
        cacheDirectory: true, 
        // transpile only the ones with changes not all, this is 
        // to check which file are transpiled and only transpile 
        // the ones that changed, for efficiency
      },
    },
  },
];
