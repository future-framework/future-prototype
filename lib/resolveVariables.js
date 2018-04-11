const _ = require('lodash')
const findDefinition = require('./definitions/find');

module.exports = (definition, variables) => {
  if (_.isEmpty(definition.input)) return variables;

  const dependencyResult = {};

  _.each(definition.input, (val, key) => {
    const dependency = findDefinition({ inputType: val });
    if (!dependency) return;

    dependencyResult[key] = dependency.fn(variables);
  });

  return _.merge(dependencyResult, variables);
};
