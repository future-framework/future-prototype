const _ = require('lodash')
const { forEach } = require('p-iteration');
const findDefinition = require('../definitions/find');
const cacheContent = require('../cache/content')

module.exports = async (definition, variables) => {
  const result = {};

  console.log(definition.input);
  await forEach(_.keys(definition.input), async (key) => {
    const inputType = await definition.input[key];

    const dependency = findDefinition({ inputType });
    if (!dependency) return;

    const get = require('../get');
    result[key] = await get(dependency.name, variables)
  });

  if (definition.cache) {
    result.cache = cacheContent(definition);
  }

  return _.merge(result, variables);
};
