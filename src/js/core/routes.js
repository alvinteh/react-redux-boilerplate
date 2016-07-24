/**
 * App routes
 * @module core/routes
 */

import React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from '../components/App';
import HomeView from '../routes/home-view/components/HomeView';

// List route configuration
const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={HomeView} />
  </Route>
);

// Export the app routes
export default routes;
