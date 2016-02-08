'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Router } from 'react-router';
import routes from './routes';
import { canUseDOM } from 'exenv';
import polyfillIntl from './utils/intlPolyfill';

// Polyfill Intl if necessary
polyfillIntl();

if (canUseDOM) {

  // Check for a stores property on __INITIAL_DATA__ so that we can bootstrap our client state if necessary.
  var initialData = JSON.parse(window.__INITIAL_DATA__).boot2react;

  if (typeof initialData.stores !== 'undefined') {
    var alt = require('./alt');
    alt.bootstrap(JSON.stringify(initialData.stores));
  }

  ReactDOM.render(
    <Router history={createBrowserHistory()} routes={routes} />,
    document.getElementById('app')
  );
}
