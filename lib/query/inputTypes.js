const _ = require('lodash')
const findDefinition = require('../definitions/find');
const resolvedInputTypes = require('./resolvedInputTypes');

module.exports = (name, variables) => {
  const filteredInputTypes = _.pickBy(resolvedInputTypes(name), (_inputType, inputName) => {
    return _.includes(_.keys(variables), inputName);
  });

  const result = [];

  _.each(filteredInputTypes, (inputType, inputName) => {
    result.push([`$${inputName}: ${inputType}`]);
  });

  return result.join(', ');
};
