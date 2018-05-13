const _ = require('lodash')
const { map } = require('p-iteration');

const allDefinitions = require('../../definitions/all')
const args = require('./args')

module.exports = async () => {
  const result = await map(allDefinitions(), async (definition) => {
    return `${definition.name}(${await args(definition)}): ${definition.outputType}`;
  });

  return result.join("\n");
};
