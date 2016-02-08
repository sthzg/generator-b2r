'use strict';

import React, { Component, PropTypes } from 'react';
import withStyles from '../../decorators/withStyles';

import styles from './HomePage.css';


@withStyles(styles)
class HomePage extends Component {
  render() {
    const total = 123456789.123;
    const totalENFmt = new Intl.NumberFormat('en', {minimumFractionDigits: 2}).format(total);
    const totalDEFmt = new Intl.NumberFormat('de', {minimumFractionDigits: 2}).format(total);
    return (
      <div className="HomePage">
        <h1>HomePage</h1>
        <p>Lorem ipsum.</p>
        <p>Format a number with English locale: {totalENFmt}</p>
        <p>Format a number with German locale: {totalDEFmt}</p>
      </div>
    );
  }
}

export default HomePage;
