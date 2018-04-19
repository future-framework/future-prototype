const _ = require('lodash')

const allDefinitions = require('../definitions/all')
const typeDefinitionInputTypes = require('./typeDefinitionInputTypes')

module.exports = () => {
  let result = '';

  _.each(allDefinitions(), (definition) => {
    result += `${definition.name}(${typeDefinitionInputTypes(definition.name)}): ${definition.outputType}\n`;
  });

  return result;
};
