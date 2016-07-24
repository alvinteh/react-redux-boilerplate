// Define required packages
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const stylelint = require('stylelint');
const webpack = require('webpack');

// Retrieve configuration
const envConfig = require('./etc/env.json');

// Define configuration variables
const ENV_NAME = process.env.WEBPACK_ENV;

// Define base configuration
var config = {
  // Define core configuration
  context: path.resolve(__dirname, './src'),
  entry: path.resolve(__dirname, './src/js/index.js'),
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: 'app.js',
    library: 'app',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /(\.hbs)$/,
        loader: 'handlebars'
      },
      {
        test: /(\.json)$/,
        loader: 'json',
        exclude: /node_modules/
      },
      {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file',
          query: {
            mimetype: 'image/svg+xml',
            name: 'fonts/[name].[ext]'
          }
      },
      {
        test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
        query: {
          mimetype: 'application/font-woff',
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
        query: {
          mimetype: 'application/octet-stream',
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
        query: {
          mimetype: 'application/octet-stream',
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file',
        query: {
          name: 'img/[name].[ext]'
        },
        include: path.resolve(__dirname, './src/img')
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    root: path.resolve(__dirname, './src')
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './src/img/misc'),
        to: path.resolve(__dirname, './lib/img/misc')
      }
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: 'body',
      template: path.resolve(__dirname, './src/html/index.hbs'),
      title: envConfig.app.title
    })
  ],

  // Define loader options
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, './src/scss')
    ]
  }
};

if (ENV_NAME === 'dev') {
  // Configure entry point
  config.entry = [
    'webpack-hot-middleware/client?reload=true',
    config.entry
  ];

  config.output.publicPath = '/';

  // Configure SCSS transpiling
  config.module.loaders.push({
    test: /\.scss$/,
    loaders: [
      'style',
      'css',
      'postcss',
      'resolve-url',
      'sass?sourceMap'
    ]
  });

  // Configure SCSS linting
  config.postcss.push(stylelint());

  // Configure JS transpiling and hot module replacement
  config.module.loaders.unshift({
    test: /(\.jsx?)$/,
    loaders: ['react-hot', 'babel'],
    exclude: /(node_modules|bower_components)/
  });

  config.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );

  // Configure JS linting
  config.module.loaders.push({
      test: /(.jsx?)$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
  });
}
else if (ENV_NAME === 'dist') {
    // Configure output filenames
  config.output.filename = 'js/app.min.js';
  config.output.publicPath = './';

  // Configure SCSS transpiling
  config.module.loaders.push({
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('style-loader', [
      'css',
      'postcss',
      'resolve-url',
      'sass?sourceMap',
      ].join('!'))
  });

  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  );

  // Configure JS transpiling
  config.module.loaders.unshift({
    test: /(\.jsx?)$/,
    loader: 'babel',
    exclude: /(node_modules|bower_components)/
  });

  // Configure JS minification
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('css/app.min.css')
  )
}

// Export configuration
module.exports = config;
