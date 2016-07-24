/**
 * App store
 * @module core/store
 */

import { routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import DevTools from '../components/DevTools';
import { createReducer } from '../utilities/reducer-factory';

// Create a collection of child reducers for population
const childReducers = [];

// Add core reducers
childReducers.router = routerReducer;

// Create and add other application reducers based on action types
const reqGlobalActionTypes = require.context('../action-types', true, /\.js$/i);

reqGlobalActionTypes.keys().forEach((filename) => {
  const reducerName = filename.split('.')[1].substr(1);
  childReducers[reducerName] = createReducer(reqGlobalActionTypes(filename));
});

// Create and add other page-specific reducers
const reqRouteActionTypes = require.context('../routes', true, /\/action\-types\/[a-z\-]+\.js$/i);

reqRouteActionTypes.keys().forEach((filename) => {
  const reducerName = filename.split('.')[1].substr(1).replace('/action-types', '');
  childReducers[reducerName] = createReducer(reqRouteActionTypes(filename));
});

// Combine the child reducers into a root reducer for the app
const appReducer = combineReducers(childReducers);

// Create the app store
const store = compose(
  applyMiddleware(thunkMiddleware, createLogger()),
  window && window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
)(createStore)(appReducer);

// Export the app store
export default store;
