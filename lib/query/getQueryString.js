const _ = require('lodash')
const findDefinition = require('../definitions/find')
const queryInputTypes = require('./inputTypes')
const functionArgs = require('./functionArgs')
const outputAttributes = require('./outputAttributes')

module.exports = async (name, variables) => {
  const definition = findDefinition({ name });

  const qInputTypes = await queryInputTypes(definition, variables)
  const qFunctionArgs = await functionArgs(name, variables)

  return `
    query(${qInputTypes}) {
      ${name}(${qFunctionArgs}) {
        ${outputAttributes(definition).join("\n")}
      }
    }
  `;
};
