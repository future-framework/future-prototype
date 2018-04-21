const _ = require('lodash')
const findDefinition = require('../../definitions/find');
const expandedVariables = require('../variables/expanded');

module.exports = async (definition, variables) => {
  const filteredInputTypes = _.pickBy(await expandedVariables(definition.name), (_inputType, inputName) => {
    return _.includes(_.keys(variables), inputName);
  });

  const result = [];

  _.each(filteredInputTypes, (inputType, inputName) => {
    result.push([`${inputName}: $${inputName}`]);
  });

  result.push([`cache: $cache`]);

  return result.join(', ');
};
