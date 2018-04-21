const _ = require('lodash')
const allDefinitions = require('../definitions/all')
const findDefinition = require('../definitions/find')
const cacheContent = require('../cache/content');
const saveCache = require('../cache/save');
const { forEach } = require('p-iteration');

module.exports = async () => {
  const result = {};

  await forEach(allDefinitions(), (definition) => {
    result[definition.name] = async (_a, variables) => {
      const resolvedVariables = await resolveVariables(definition, variables);
      const finalResult = await definition.fn(resolvedVariables);
      saveCache(definition, finalResult);
      return finalResult;
    };
  });

  return result;
};

const resolveVariables = require('./resolveVariables')
