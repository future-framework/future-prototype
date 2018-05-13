const _ = require('lodash')
const fs = require('fs');
const converter = require('number-to-words')

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
  opts.name = opts.name || `futureAnonymousFunction${_.upperFirst(_.camelCase(converter.toWords(_.random(0, 1000))))}`;

  if (_.isEmpty(opts.output)) throw `Error in function: ${opts.name}. Output cannot be empty.`;

  const definition = createDefinition({
    fn,
    filename: getFilename(),
    cacheFilename: cacheFilename(getFilename(), opts),
    inputType: `${_.upperFirst(_.camelCase(opts.name))}Input`,
    outputType: _.upperFirst(_.camelCase(opts.name)),
    ...opts,
    input: typifyInput(opts.input || {}),
  });

  const result = (variables) => {
    const get = require('./get');
    const innerResult = get(definition.name, variables);
    Object.defineProperty(innerResult, 'futureName', { value: definition.name })
    return innerResult;
  };

  Object.defineProperty(result, 'name', { value: fn.name })
  Object.defineProperty(result, 'definition', { value: definition })

  return result;
};
