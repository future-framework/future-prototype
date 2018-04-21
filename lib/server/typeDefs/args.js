const _ = require('lodash')
const expandedVariables = require('../../query/variables/expanded');
const findDefinition = require('../../definitions/find');

module.exports = async (definition) => {
  const result = _.map(await expandedVariables(definition), (inputType, inputName) => {
    return `${inputName}: ${inputType}`;
  });

  return result.join(', ');
};
