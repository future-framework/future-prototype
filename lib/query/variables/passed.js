const _ = require('lodash')
const expanded = require('./expanded')

module.exports = async (definition, variables) => {
  return _.pickBy(await expanded(definition), (_inputType, inputName) => {
    return _.includes(_.keys(variables), inputName);
  });
}
