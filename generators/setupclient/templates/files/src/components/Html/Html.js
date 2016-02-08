'use strict';

import config from 'config';
import Helmet from 'react-helmet';
import React, { Component, PropTypes } from 'react';

class Html extends Component {
  render() {
    // On the server-render pass we pass in data for the head manually, otherwise updates are handled by Helmet.
    let head = (typeof head === 'undefined') ? this.props.data.head : head;
    return (
      <html className="no-js" lang="">
      <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        {/* Management of the head components provided by react-helmet */}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
      </head>
      <body>
      {/* Populated with result from server-side-rendering as HTML to render correctly even /wo active JS. */}
      <div id="app" dangerouslySetInnerHTML={{__html: this.props.data.body}}></div>
      {/* We stick the initial data provided from the server to the window object so that the user agent can pick it up. */}
      <script dangerouslySetInnerHTML={{__html: `window.__INITIAL_DATA__ = '${JSON.stringify(this.props.data.initialData)}';`}}></script>
      {/* Depending on the current stage environment (dev|production) serve build from different directory. */}
      <script src={`${config.staticPath}/${config.buildDir}/app.js`}></script>
      </body>
      </html>
    );
  }
}

export default Html;
