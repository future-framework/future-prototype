const _ = require('lodash')
const findDefinition = require('../definitions/find');

module.exports = (name) => {
  const definition = findDefinition({ name });
  const result = {};

  _.each(definition.input, (inputType, inputName) => {
    result[inputName] = inputType;

    const dependency = findDefinition({ inputType });
    if (!dependency) return;

    _.each(dependency.input, (dependencyInputType, dependencyInputName) => {
      result[dependencyInputName] = dependencyInputType;
    });
  });

  result.cache = definition.inputType;

  return result;
};
