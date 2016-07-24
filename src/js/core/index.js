/**
 * App entry point
 * @module core/index
 */

import React from 'react';
import { render } from 'react-dom';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';

import DevTools from '../components/DevTools';
import config from '../../../etc/env.json';
import store from './store';
import routes from './routes';

// Determine whether the app should be in production mode
const isProduction = config.app.environment === 'production';

// Initialize Google Analytics
ReactGA.initialize(config.googleAnalytics.id);

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

// Render the app
render(
  <Provider store={store}>
    <div>
      <Router
        history={browserHistory}
        onUpdate={isProduction ? logPageView : null}
        routes={routes}
      />
      {isProduction ? '' : <DevTools />}
    </div>
  </Provider>,
  document.getElementById('app')
);
