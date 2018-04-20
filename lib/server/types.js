const _ = require('lodash')

const allDefinitions = require('../definitions/all')
const attributeTypes = require('./attributeTypes')

module.exports = () => {
  let result = '';

  _.each(allDefinitions(), (definition) => {
    result += `
      type ${definition.outputType} {
        ${attributeTypes(definition)}
      }\n
      input ${definition.inputType} {
        ${attributeTypes(definition)}
      }\n
    `;
  });

  return result;
};
