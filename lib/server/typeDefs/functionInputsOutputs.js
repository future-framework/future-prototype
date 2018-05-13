const _ = require('lodash')

const allDefinitions = require('../../definitions/all')
const attributes = require('./attributes')

module.exports = () => {
  let result = '';

  _.each(allDefinitions(), (definition) => {
    result += `
      type ${definition.outputType} {
        ${attributes(definition)}
      }\n
      input ${definition.inputType} {
        ${attributes(definition)}
      }\n
    `;
  });

  return result;
};
