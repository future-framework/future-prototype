const _ = require('lodash')
const fs = require('fs');

const get = require('./get');
const createDefinition = require('./definitions/create');
const findDefinition = require('./definitions/find');
const getFilename = require('./getFilename');
const cacheFilename = require('./cache/filename');

// const output = (opts) => {
//   const definition = findDefinition({ name: opts.name });
//   if (!definition.cache) return {};
//   if (cacheExists(definition)) return cacheContent(definition);
//
//   if (opts.cache == 'error') {
//     throw new Error(`Cache at ${cacheFilename(definition.cacheFilename)} missing.`);
//   }
//
//   return {};
// };

module.exports = function(fn, opts) {
  createDefinition({
    fn,
    filename: getFilename(),
    cacheFilename: cacheFilename(getFilename(), opts),
    inputType: `${_.upperFirst(_.camelCase(opts.name))}Input`,
    outputType: _.upperFirst(_.camelCase(opts.name)),
    ...opts,
  });

  const result = (variables) => {
    const innerResult = get(fn.name, variables);
    Object.defineProperty(innerResult, 'name', { value: fn.name });
    return innerResult;
  };

  return result;
};
