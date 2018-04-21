const _ = require('lodash')
const { forEach } = require('p-iteration');

const findDefinition = require('../../definitions/find');

module.exports = async (name) => {
  const definition = findDefinition({ name });
  const result = {};

  await forEach(_.keys(definition.input), async (inputName) => {
    const inputType = await definition.input[inputName];
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
