const _ = require('lodash')
const expandedVariables = require('../../query/variables/expanded');
const findDefinition = require('../../definitions/find');

module.exports = async (definition) => {
  const inputTypes = await expandedVariables(definition)

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
