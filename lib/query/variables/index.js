const _ = require('lodash')
const getInputVariables = require('./input')

module.exports = async (definition, directVariables) => {
  const getInputVariables = require('./input')
  const inputVariables = await getInputVariables(definition, directVariables);
  console.log(definition.input);
  console.log('inputVariables', inputVariables);

  return _.merge(inputVariables, directVariables);
};
