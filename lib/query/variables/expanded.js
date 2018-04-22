const _ = require('lodash')
const { forEach } = require('p-iteration');

const findDefinition = require('../../definitions/find');
const allDependencies = require('../../dependencies/all');

module.exports = async (definition) => {
  const result = {};

  const dependencies = await allDependencies(definition);
  await forEach(_.keys(dependencies), async (key) => {
    const dependency = dependencies[key];

    const expanded = require('./expanded')
    const dependencyVariables = await expanded(dependency);

    await forEach(_.keys(dependencyVariables), async (dependencyVariableKey) => {
      result[dependencyVariableKey] = await dependencyVariables[dependencyVariableKey];
    });
  });

  result.cache = definition.inputType;

  return _.merge(result, definition.input);
};
