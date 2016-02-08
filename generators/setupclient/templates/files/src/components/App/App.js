'use strict';

import config from 'config';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import React from 'react';
import withStyles from '../../decorators/withStyles';

import styles from './App.css';


@withStyles(styles)
class App extends React.Component {

  render() {
    return (
      <div className="App">
        { this.renderHelmet() }
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/redirect">Redirect</Link></li>
        </ul>
        {this.props.children}
      </div>
    );
  }

  renderHelmet() {
    return(
      <Helmet
        title="Welcome"
        titleTemplate={config.titleTemplate}
        meta={[
            {"name": "description", "content": config.metaDescription}
          ]}
        link={[
            {"rel": "canonical", "href": ""},
            (config.appEnv === 'production')
              ? {"rel": "stylesheet", "href": `${config.staticPath}/${config.buildDir}/bundle.css`}
              : {},
            {"rel": "apple-touch-icon", "href": ""},
            {"rel": "apple-touch-icon", "sizes": "72x72", "href": ""}
          ]}
      />
    );
  }
}

export default App;
