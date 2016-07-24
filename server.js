// Define required packages
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

// Retrieve configuration
const envConfig = require('./etc/env.json');
const webpackConfig = require('./webpack.config.js');

// Define configuration variables
const ENV_NAME = process.env.WEBPACK_ENV;
const DEV_SERVER_CONFIG = envConfig.devServer;

//Initialize app
const app = express();

const compiler = webpack(webpackConfig);
const middleware = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  noInfo: false,
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  },
  silent: true
});

app.use(middleware);
app.use(webpackHotMiddleware(compiler));

app.use(express.static(webpackConfig.output.publicPath));

app.get('*', function response(req, res) {
  res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'lib/index.html')));
  res.end();
});

// Start server
app.listen(DEV_SERVER_CONFIG.port);
