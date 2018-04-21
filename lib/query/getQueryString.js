const _ = require('lodash')
const findDefinition = require('../definitions/find')
const queryArgs = require('./args/query')
const functionArgs = require('./args/function')
const outputAttributes = require('./outputAttributes')

module.exports = async (definition, variables) => {
  const queryArgsResult = await queryArgs(definition, variables)
  const functionArgsResult = await functionArgs(definition, variables)

  return `
    query(${queryArgsResult}) {
      ${definition.name}(${functionArgsResult}) {
        ${outputAttributes(definition).join("\n")}
      }
    }
  `;
};
