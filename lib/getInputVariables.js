const _ = require('lodash')
const { forEach } = require('p-iteration');
const findDefinition = require('./definitions/find')

module.exports = async (definition, directVariables) => {
  const result = {};

  await forEach(_.keys(definition.input), async (key) => {
    console.log('inputType', key, definition.input[key]);
    const inputType = await definition.input[key];
    console.log('after')
    console.log('inputTypei2', key, definition.input[key]);
    const dependency = findDefinition({ inputType });
    if (!dependency) return;

    result[key] = await get(dependency.name, directVariables);
  });

  return result;
};

const get = require('./get')
