'use strict';

var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var proxy = require('proxy-middleware');
var config = require('./webpack.config')[0];

var backendPort = process.env.npm_package_config_backend_port;
var devServerPort = process.env.npm_package_config_devserver_port;


config.entry = {
  bundle: [
    `webpack-hot-middleware/client?http://localhost:${devServerPort}`,
    config.entry.bundle
  ]
};

config.plugins.push(
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
);

config.devtool = 'cheap-module-eval-source-map';

var app = new require('express')();

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));
app.use(proxy(`http://localhost:${backendPort}`));

app.listen(devServerPort, function (error) {
  if (error) {
    console.error(error);
  } else {
    console.info(
      "Listening on port %s. Open up http://localhost:%s/ in your browser.", devServerPort, devServerPort);
  }
});
