const _ = require('lodash')

const queryArgs = require('./args/query')
const functionArgs = require('./args/function')
const outputAttributes = require('./output/attributes')

module.exports = async (definition, variables) => {
  return `
    query(${await queryArgs(definition, variables)}) {
      ${definition.name}(${await functionArgs(definition, variables)}) {
        ${outputAttributes(definition)}
      }
    }
  `;
};
