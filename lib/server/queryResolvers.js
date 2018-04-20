const _ = require('lodash')
const allDefinitions = require('../definitions/all')
const findDefinition = require('../definitions/find')
const resolveVariables = require('./resolveVariables')

module.exports = async () => {
  const result = {};

  await allDefinitions().forEach(async (definition, aa) => {
    result[definition.name] = async (_a, variables) => {
      if (_.isEmpty(definition.input)) return await definition.fn(variables);

      const dependencyResult = {};

      await _.keys(definition.input).forEach(async (key) => {
        const val = definition.input[key];

        if (val.then) {
          dependencyResult[key] = await val;
        } else {
          const dependency = findDefinition({ inputType: val });
          if (!dependency) return;

          dependencyResult[key] = await dependency.fn(variables);
        }
      });

      return definition.fn(await resolveVariables(definition, variables));
    };
  });

  return result;
};
