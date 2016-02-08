'use strict';

import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import App from './components/App';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';


const routeConfig = [
  { path: '/',
    component: App,
    indexRoute: { component: HomePage },
    childRoutes: [
      { path: 'features', component: FeaturesPage },
      { path: 'redirect', onEnter: (nextState, replaceState) => replaceState(null, 'features') },
      { path: '*', component: NotFoundPage }
    ]
  }
];

export default routeConfig;
