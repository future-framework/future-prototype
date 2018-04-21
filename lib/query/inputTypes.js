const _ = require('lodash')
const findDefinition = require('../definitions/find');
const resolvedInputTypes = require('./resolvedInputTypes');

module.exports = async (definition, variables) => {
  const filteredInputTypes = _.pickBy(await resolvedInputTypes(definition.name), (_inputType, inputName) => {
    return _.includes(_.keys(variables), inputName);
  });

  const result = [];

  _.each(filteredInputTypes, (inputType, inputName) => {
    result.push([`$${inputName}: ${inputType}`]);
  });

  result.push([`$cache: ${definition.inputType}`]);

  return result.join(', ');
};
