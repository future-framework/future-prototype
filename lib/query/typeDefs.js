const _ = require('lodash')
const { map } = require('p-iteration');

const allDefinitions = require('../definitions/all')
const typeDefinitionInputTypes = require('./typeDefinitionInputTypes')

module.exports = async () => {
  const result = await map(allDefinitions(), async (definition) => {
    const args = await typeDefinitionInputTypes(definition.name);
    const r = `${definition.name}(${args}): ${definition.outputType}`;
    return r;
  });

  return result.join("\n");
};
