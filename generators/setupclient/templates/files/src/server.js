'use strict';

import 'babel-core/polyfill';
import bodyParser from 'body-parser';
import express from 'express';
import Helmet from 'react-helmet';
import Html from './components/Html';
import { match, RoutingContext } from 'react-router';
import polyfillIntl from './utils/intlPolyfill';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import routes from './routes';

var app = express();
const port = process.env.RENDER_SERVER_PORT || 5002;


// Polyfill Intl if necessary
// –––––
polyfillIntl();


// Register Node.js middleware
// –––––

app.use(bodyParser.json());


// App routes
// –––––

/**
 * Render requests are targeted with a POST against the /api/render endpoint.
 *
 * The request body should be of Content-Type application/json and provide the following keys
 * @param reqURI: String        the route to render
 * @param initialData: Object   an object containing initial data that will be provided to the React app
 *
 * The endpoint may return the following results
 * 200    everything went fine, a result of the request is contained within the response body as Json
 * 302    the React app signals a redirect to another endpoint
 * 404    the requested resource was not found
 * 500    a server error occured
 *
 */
app.post('/api/render', function (req, res) {

  let reqURI = req.body.reqURI;
  let initialData = req.body.initialData;
  let result = {
    httpStatus: null,
    error: null,
    body: null,
    redirect: false,
    redirectTo: null
  };

  // Resolve request and populate result object with data.
  match({ routes, location: reqURI }, (error, redirectLocation, renderProps) => {

    // Server errors
    if (error) {
      result.httpStatus = 500;
      result.error = `Error: ${error.message}`;

    // Redirection
    } else if (redirectLocation) {
      result.httpStatus = 302;
      result.redirect = true;
      result.redirectTo = `${redirectLocation.pathname}${redirectLocation.search}`;

    // Content delivery for 200 and 404
    } else if (renderProps) {
      // TODO check every release if an official API for this use case lands
      // this hack is currently necessary to analyze if no other than the * route matches which means that we
      // need to return a 404 status: https://github.com/rackt/react-router/issues/458
      if(renderProps.routes[renderProps.routes.length - 1].path === '*') {
        result.httpStatus = 404;
      } else {
        result.httpStatus = 200;
      }

      // FIXME this ties us to using alt
      let alt = require('./alt');
      let stores = (typeof initialData.boot2react.stores === 'undefined') ? {} : initialData.boot2react.stores;
      alt.bootstrap(JSON.stringify(stores));
      const body = ReactDOMServer.renderToStaticMarkup(<RoutingContext {...renderProps}/>);
      alt.flush();

      const head = Helmet.rewind();
      const data = {
        head: head,
        body: body,
        initialData: initialData
      };
      result.body = ReactDOMServer.renderToStaticMarkup(<Html data={data}/>);
    }
  });

  res.set('Content-Type', 'application/json; charset=utf-8');
  res.send(JSON.stringify(result));
});


// Runner
// –––––

var server = app.listen(port, '127.0.0.1', () => {  // TODO host should be configurable through npm config
  console.log('Render server listening at http://127.0.0.1:%s', port);
});
