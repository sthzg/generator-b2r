'use strict';

/**
 * This decorator is of course heavily "inspired" by the wonderful solution found in kriasoft's React Starter Kit.
 * https://github.com/kriasoft/react-starter-kit/blob/master/src/decorators/withStyles.js
 *
 * As you can see this version is a dumbed down version of that decorator. We currently don't do all the house
 * keeping that could be found there because we use a bundled CSS on production and use the inline styles only in dev.
 */

import React, { PropTypes, Component } from 'react';
import { canUseDOM } from 'exenv';


function withStyles(styles) {
  return (ComposedComponent) => class WithStyles extends Component {

    constructor() {
      super();
      this.styles = styles;
      this.isUsable = (typeof this.styles.use !== 'undefined' && typeof this.styles.use === 'function');
    }

    componentDidMount() {
      if (canUseDOM && this.isUsable) {
        this.styles.use();
      }
    }

    componentWillUnmount() {
      if (canUseDOM && this.isUsable) {
        this.styles.unuse();
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }
}

export default withStyles;
