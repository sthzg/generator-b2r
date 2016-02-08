'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var _ = require('lodash');

const nodeEnv = process.env.NODE_ENV || process.env.BABEL_ENV || 'dev';
const PRODUCTION = nodeEnv === 'production';
const DEBUG = nodeEnv === 'dev';
const VERBOSE = false;  // TODO control with cl option

/** Src directory of the React code */
const codeSrcPath = path.join(__dirname, 'src');

/** Output path for browser builds in dev and production environment. */
const browserOutputPath = path.join(__dirname, (PRODUCTION) ? 'build' : 'build-tmp', 'browser');

/** Output path for server builds in dev and production environment. */
const serverOutputPath = path.join(__dirname, (PRODUCTION) ? 'build' : 'build-tmp', 'server');


// Custom plugins
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A webpack plugin to notify the backend about finished compilations of the app bundle
 * @constructor
 */
// TODO implement
function NotifyBackendPlugin() {
}
NotifyBackendPlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', function () {
    console.log('Build chunk with name %s complete', compiler.name);
  });
};


var plugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.DedupePlugin(),
  new NotifyBackendPlugin()
];

if (PRODUCTION) {
  plugins = plugins.concat([
    new ExtractTextPlugin("bundle.css"),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: {comments: false},
      test: /app\.js?$/
    })
  ]);
}


// Base Configuration
// ---------------------------------------------------------------------------------------------------------------------

const config = {
  cache: true,  // <-- TODO RTM for clarification and set accordingly
  debug: DEBUG,
  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE
  },
  output: {
    publicPath: '/'
  },
  plugins: plugins,
  module: {
    loaders: [
      {test: /\.(png|gif)$/, loader: 'url-loader?name=[name]@[hash].[ext]&limit=5000'},
      {test: /\.svg$/, loader: 'url-loader?name=[name]@[hash].[ext]&limit=5000!svgo-loader?useConfig=svgo1'},
      {test: /\.(pdf|ico|jpg|eot|otf|woff|ttf|mp4|webm)$/, loader: 'file-loader?name=[name]@[hash].[ext]'},
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.jsx?$/, include: codeSrcPath, loader: 'babel-loader'},
      (PRODUCTION
        ? {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')}
        : {test: /\.css$/, loader: 'style/useable!css'})
    ]
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'],
    alias: {
      config: `${codeSrcPath}/config/${nodeEnv}`
    }
  },
  svgo1: {
    multipass: true,
    plugins: [
      // by default enabled
      {mergePaths: false},
      {convertTransform: false},
      {convertShapeToPath: false},
      {cleanupIDs: false},
      {collapseGroups: false},
      {transformsWithOnePath: false},
      {cleanupNumericValues: false},
      {convertPathData: false},
      {moveGroupAttrsToElems: false},
      // by default disabled
      {removeTitle: true},
      {removeDesc: true}
    ]
  }
};


// NodeJS Configuration (server-node.js)
// ---------------------------------------------------------------------------------------------------------------------

const nodeConfig = _.merge({}, config, {
  name: 'nodejs',
  entry: {bundle: `${codeSrcPath}/server.js`},
  output: {
    path: serverOutputPath,
    filename: 'server-node.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  devtool: 'source-map'
});


// Browser Configuration (app.js)
// ---------------------------------------------------------------------------------------------------------------------

const browserConfig = _.merge({}, config, {
  name: 'browser',
  entry: {bundle: `${codeSrcPath}/main.js`},
  output: {
    path: browserOutputPath,
    publicPath: (PRODUCTION)  // TODO need to clarify this, should we make it configurable?
      ? "/static/build/"
      : "/static/build-tmp",
    filename: 'app.js'
  }
});

// Adding HMR settings for non-production browser builds.
if(!PRODUCTION) {
  _.forEach(browserConfig.module.loaders, (loader) => {
    if (loader.loader !== 'babel-loader') return;  // TODO also check if we are actually in --watch mode
    loader.query = {
      plugins: ['react-transform'],
      extra: {
        'react-transform': {
          transforms: [
            {
              transform: 'react-transform-hmr',
              imports: ['react'],
              locals: ['module']
            }
          ]
        }
      }
    }
  });
}

module.exports = [browserConfig, nodeConfig];
