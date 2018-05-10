const _ = require('lodash')

const passedVariables = require('../variables/passed')

module.exports = async (definition, variables) => {
  const result = [];

  _.each(await passedVariables(definition, variables), (inputType, inputName) => {
    result.push([`$${inputName}: ${inputType}`]);
  });

  result.push([`$cache: ${definition.inputType}`]);

  return result.join(', ');
};
