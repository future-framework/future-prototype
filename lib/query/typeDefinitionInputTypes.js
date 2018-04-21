const _ = require('lodash')
const resolvedInputTypes = require('./resolvedInputTypes');
const findDefinition = require('../definitions/find');

module.exports = async (name) => {
  const inputTypes = await resolvedInputTypes(name)

  const result = _.map(inputTypes, (inputType, inputName) => {
    if (inputType.name) {
      const definition = findDefinition({ name: inputType.name });
      return [`${inputName}: ${definition.inputType}`];
    } else {
      return [`${inputName}: ${inputType}`];
    }
  });

  return result.join(', ');
};
