const _ = require('lodash')

module.exports = async () => {
  const result = {};

  await allDefinitions().forEach(async (definition, aa) => {
    result[definition.name] = async (_a, variables) => {
      if (_.isEmpty(definition.input)) return definition.fn(variables);

      const dependencyResult = {};

      await _.keys(definition.input).forEach(async (key) => {
        const val = definition.input[key];

        if (val.then) {
          dependencyResult[key] = await val;
        } else {
          const dependency = findDefinition({ inputType: val });
          if (!dependency) return;

          dependencyResult[key] = dependency.fn(variables);
        }
      });

      return definition.fn(resolveVariables(definition, variables));
    };
  });

  return result;
};
