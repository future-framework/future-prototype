const _ = require('lodash')

const get = require('./get');
const createDefinition = require('./definitions/create');

const train = (opts) => {
  if (!opts.train) return;

  const {
    train: {
      fn,
      data,
    },
  } = opts;

  return fn(data);
};

module.exports = function(fn, opts) {
  const trainedData = train(opts);

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
