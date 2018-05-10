const _ = require('lodash')
const expandedVariables = require('../../query/variables/expanded');

module.exports = async (definition) => {
  const result = _.map(await expandedVariables(definition), (inputType, inputName) => {
    return `${inputName}: ${inputType}`;
  });

  return result.join(', ');
};
