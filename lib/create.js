const _ = require('lodash')
const fs = require('fs');

const createDefinition = require('./definitions/create');
const getFilename = require('./getFilename');
const cacheFilename = require('./cache/filename');
const findDefinition = require('./definitions/find')

const typifyInput = (input) => {
  const result = {};

  _.each(input, (inputType, key) => {
    if (inputType.futureName) {
      const definition = findDefinition({ name: inputType.futureName });
      result[key] = definition.inputType;
    } else {
      result[key] = inputType;
    }
  });

  return result;
};

module.exports = function(fn, opts) {
  const definition = createDefinition({
    fn,
    filename: getFilename(),
    cacheFilename: cacheFilename(getFilename(), opts),
    inputType: `${_.upperFirst(_.camelCase(opts.name))}Input`,
    outputType: _.upperFirst(_.camelCase(opts.name)),
    ...opts,
    input: typifyInput(opts.input),
  });

  const result = (variables) => {
    const get = require('./get');
    const innerResult = get(fn.name, variables);
    Object.defineProperty(innerResult, 'futureName', { value: fn.name })
    return innerResult;
  };

  Object.defineProperty(result, 'name', { value: fn.name })
  Object.defineProperty(result, 'definition', { value: definition })

  return result;
};
