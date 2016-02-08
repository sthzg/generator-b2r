'use strict';

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';

class ErrorPage extends Component {
  render() {
    return (
      <div className="ErrorPage">
        <Helmet
          title="Error"
          meta={[
            {"name": "description", "content": "An error occured."}
          ]}
          />
        <h1>ErrorPage</h1>
        <p>Lorem ipsum</p>
      </div>
    );
  }
}

export default ErrorPage;
