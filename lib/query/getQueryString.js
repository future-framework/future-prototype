const _ = require('lodash')
const findDefinition = require('../definitions/find')
const queryArgs = require('./args/query')
const functionArgs = require('./args/function')
const outputAttributes = require('./outputAttributes')

module.exports = async (name, variables) => {
  const definition = findDefinition({ name });

  const qInputTypes = await queryArgs(definition, variables)
  const qFunctionArgs = await functionArgs(name, variables)

  return `
    query(${qInputTypes}) {
      ${name}(${qFunctionArgs}) {
        ${outputAttributes(definition).join("\n")}
      }
    }
  `;
};
