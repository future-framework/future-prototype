const _ = require('lodash')
const resolvedInputTypes = require('./resolvedInputTypes');
const findDefinition = require('../definitions/find');

module.exports = (name) => {
  const result = [];

  _.each(resolvedInputTypes(name), (inputType, inputName) => {
    if (inputType.name) {
      const definition = findDefinition({ name: inputType.name });
      result.push([`${inputName}: ${definition.inputType}`]);
    } else {
      result.push([`${inputName}: ${inputType}`]);
    }
  });

  return result.join(', ');
};
