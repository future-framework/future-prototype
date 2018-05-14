const _ = require('lodash')

const allDefinitions = require('../../definitions/all')
const attributes = require('./attributes')

module.exports = () => {
  let result = '';

  _.each(allDefinitions(), (definition) => {
    result += `
      type ${definition.outputType} {
        ${attributes(definition.output)}
      }\n

      input ${definition.inputType} {
        ${attributes(definition.input) || 'future: Int'}
      }\n
    `;
  });

  return result;
};
