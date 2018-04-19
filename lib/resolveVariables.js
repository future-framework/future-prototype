const _ = require('lodash')
const findDefinition = require('./definitions/find');

module.exports = async (definition, variables, isCollection) => {
  if (_.isEmpty(definition.input)) return variables;

  const dependencyResult = {};

  await _.keys(definition.input).forEach(async (key) => {
    const val = definition.input[key];

    if (val.then) {
      dependencyResult[key] = await val;
    } else {
      const dependency = findDefinition({ inputType: val });
      if (!dependency) return true;

      dependencyResult[key] = isCollection ? dependency.fn : dependency.fn(variables);
    }
  });

  return _.merge(dependencyResult, variables);
};
