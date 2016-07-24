/**
 * Action Type Factory
 * @module utilities/action-type-factory
 */

/*
 * Creates a dictionary of action types.
 *
 * @param {string} prefix The prefix to be applied to the action types
 * @param {string[]} actionTypes The action types to be created
 *
 * @return {Object.<string, string>} A dictionary of action types
 */
export function createActionTypes(prefix, actionTypes) {
  const ret = {};

  // Format the prefix to follow redux naming conventions
  const formattedPrefix = prefix ? `@@${prefix}/` : '';

  // Build a dictionary with the supplied action types
  actionTypes.forEach(actionType => {
    ret[actionType] = `${formattedPrefix}${actionType}`;
  });

  return ret;
}
