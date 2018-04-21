const _ = require('lodash')
const { forEach } = require('p-iteration');

const findDefinition = require('../../definitions/find');

module.exports = async (name) => {
  const definition = findDefinition({ name });
  const result = {};

  await forEach(_.keys(definition.input), async (key) => {
    result[key] = await definition.input[key];
  });

  await forEach(_.keys(definition.dependencies), async (key) => {
    const dependency = definition.dependencies[key];
    result[key] = await dependency.inputType;
  });

  result.cache = definition.inputType;
  return result;
};
