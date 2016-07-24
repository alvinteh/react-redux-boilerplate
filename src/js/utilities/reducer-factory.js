/**
 * Reducer Factory
 * @module utilities/reducer-factory
 */

import { extend, values } from 'lodash';

/*
 * Creates a reducer.
 *
 * @param {Object.<string, string>} actionTypes The dictionary of action types
 *
 * @return {Function} A reducer comprising reducers which handle the specified action types
 */
export function createReducer(actionTypes) {
  const childReducers = [];

  // Create a child reducer for each action type
  values(actionTypes).forEach((actionType) => {
    childReducers[actionType] = (state, action) => {
      // Use the suffix of the action type to determine its class (request/failure/success)
      const actionClass = actionType.split('_').pop();

      let newState = [];

      // Use the action class to build a new state object
      switch (actionClass) {
        case 'REQUEST':
          if (actionType.indexOf('@@POSTS_GRID/GET_POSTS_REQUEST') >= 0
            || actionType.indexOf('@@ROUTES_SEARCH-VIEW/SEARCH_REQUEST') >= 0
            || actionType.indexOf('@@ROUTES_TAGS-TAG-VIEW/POSTS_REQUEST') >= 0) {
            newState = extend({}, state, action.data);
          }
          else {
            newState = extend({}, state, { isRequesting: true });
          }
          break;
        case 'FAILURE':
          newState = extend({}, state, { error: action.error });
          delete newState.isRequesting;
          break;
        case 'SUCCESS':
        default:
          newState = extend({}, state, action.data);
          delete newState.isRequesting;
          break;
      }

      return newState;
    };
  });

  // Create the parent reducer
  const reducer = (state, action) => {
    const actionType = action.type;
    const childReducer = childReducers[actionType];

    // Reset the state if we cannot find a child reducer
    if (typeof childReducer !== 'function') {
      return state || {};
    }

    return childReducer(state, action);
  };

  return reducer;
}
