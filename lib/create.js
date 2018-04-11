const _ = require('lodash')

const get = require('./get');
const createDefinition = require('./definitions/create');
const resolveVariables = require('./resolveVariables');

const train = (definition) => {
  if (!definition) return;

  const {
    fn,
    variables,
  } = definition;

  return fn(resolveVariables(definition, variables, 'isCollection'));
};

module.exports = function(fn, opts) {
  const trainedData = train(opts.train);

  createDefinition({
    fn: (innerVariables) => fn(_.merge(innerVariables, { train: trainedData })),
    ...opts,
    inputType: `${_.upperFirst(_.camelCase(opts.name))}Input`,
    outputType: _.upperFirst(_.camelCase(opts.name)),
  });

  const result = async (variables) => {
    return await get(fn.name, variables);
  };

  Object.defineProperty(result, 'name', { value: fn.name });
  return result;
};
