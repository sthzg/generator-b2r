'use strict';

import React, { Component, PropTypes } from 'react';
import withStyles from '../../decorators/withStyles';
import Helmet from 'react-helmet';

import styles from './FeaturesPage.css';


@withStyles(styles)
class FeaturesPage extends Component {

  render() {
    return (
      <div className="FeaturesPage">
        <Helmet
          title="Features"
          meta={[
            {"name": "description", "content": "Learn more about the features of this starter kit"}
          ]}
          />
        <h1>FeaturesPage</h1>
        <p>Lorem ipsum</p>
      </div>
    );
  }
}

export default FeaturesPage;
