'use strict';

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';


class NotFoundPage extends Component {
  render() {
    return (
      <div className="NotFoundPage">
        <Helmet title="Not found" />
        <h1>Page not found</h1>
      </div>
    );
  }
}

export default NotFoundPage;
