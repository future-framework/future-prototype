const _ = require('lodash')
const expandedVariables = require('./variables/expanded');
const findDefinition = require('../definitions/find');

module.exports = async (name) => {
  const inputTypes = await expandedVariables(name)

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
