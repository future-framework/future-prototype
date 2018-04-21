const _ = require('lodash')
const getInputVariables = require('./input')

module.exports = async (definition, directVariables) => {
  const getInputVariables = require('./input')
  const inputVariables = await getInputVariables(definition, directVariables);

  return _.merge(inputVariables, directVariables);
};
