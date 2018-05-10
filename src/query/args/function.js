const _ = require('lodash')
const passedVariables = require('../variables/passed')

module.exports = async (definition, variables) => {
  const result = [];

  _.each(await passedVariables(definition, variables), (inputType, inputName) => {
    result.push([`${inputName}: $${inputName}`]);
  });

  result.push([`cache: $cache`]);

  return result.join(', ');
};
