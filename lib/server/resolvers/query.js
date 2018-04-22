const _ = require('lodash')
const allDefinitions = require('../../definitions/all')
const saveCache = require('../../cache/save');

module.exports = async () => {
  return _.reduce(allDefinitions(), (memo, definition) => {
    memo[definition.name] = async (_ctx, variables) => {
      const resolveVariables = require('./resolveVariables')
      const resolvedVariables = await resolveVariables(definition, variables);
      const result = await definition.fn(resolvedVariables);
      saveCache(definition, result);
      return result;
    };

    return memo;
  }, {});
};
