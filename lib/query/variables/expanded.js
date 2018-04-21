const _ = require('lodash')
const { forEach } = require('p-iteration');

const findDefinition = require('../../definitions/find');

module.exports = async (definition) => {
  const result = {};

  await forEach(_.keys(definition.input), async (key) => {
    result[key] = await definition.input[key];
  });

  await forEach(_.keys(definition.dependencies), async (key) => {
    const dependency = definition.dependencies[key];

    const expanded = require('./expanded')
    const dependencyVariables = await expanded(dependency);
    await forEach(_.keys(dependencyVariables), async (dependencyVariableKey) => {
      result[dependencyVariableKey] = await dependencyVariables[dependencyVariableKey];
    });
  });

  result.cache = definition.inputType;
  return result;
};
