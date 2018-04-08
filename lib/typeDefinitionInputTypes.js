const _ = require('lodash')
const inputTypes = require('./inputTypes');

module.exports = (name) => {
  const result = [];

  _.each(inputTypes(name), (inputType, inputName) => {
    result.push([`${inputName}: ${inputType}`]);
  });

  return result.join(', ');
};
