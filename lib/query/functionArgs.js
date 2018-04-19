const _ = require('lodash')
const findDefinition = require('../definitions/find');
const inputTypes = require('./inputTypes');

module.exports = (name, variables) => {
  const filteredInputTypes = _.pickBy(inputTypes(name), (_inputType, inputName) => {
    return _.includes(_.keys(variables), inputName);
  });

  const result = [];

  _.each(filteredInputTypes, (inputType, inputName) => {
    result.push([`${inputName}: $${inputName}`]);
  });

  return result.join(', ');
};
