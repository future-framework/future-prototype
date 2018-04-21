const _ = require('lodash')
const findDefinition = require('../definitions/find')

module.exports = (opts) => {
  const filteredDependencies = _.pickBy(opts.input, (inputType, key) => {
    return findDefinition({ inputType });
  });

  return _.reduce(filteredDependencies, (memo, inputType, key) => {
    memo[key] = findDefinition({ inputType });
    return memo;
  }, {});
};
