const _ = require('lodash')
const fs = require('fs');
const path = require('path');
const callsite = require('callsite');

const get = require('./get');
const createDefinition = require('./definitions/create');
const findDefinition = require('./definitions/find');
const resolveVariables = require('./resolveVariables');

const cacheContent = (definition) => {
  return JSON.parse(fs.readFileSync(definition.cacheFilename, 'utf8'));
};

const extractDir = (filename) => {
  return path.dirname(filename);
};

const cacheFilename = (fnFilename, opts) => {
  return `${extractDir(fnFilename)}/${opts.name}-cache.json`;
};

const cacheExists = (definition) => {
  return fs.existsSync(definition.cacheFilename);
};

const output = (opts) => {
  const definition = findDefinition({ name: opts.name });
  if (!definition.cache) return {};
  if (cacheExists(definition)) return cacheContent(definition);

  if (opts.cache == 'error') {
    throw new Error(`Cache at ${cacheFilename(definition.cacheFilename)} missing.`);
  }

  return {};
};

const filename = () => {
  const stack = callsite();
  return stack[2].getFileName();
};

module.exports = function(fn, opts) {
  createDefinition({
    fn,
    filename: filename(),
    cacheFilename: cacheFilename(filename(), opts),
    inputType: `${_.upperFirst(_.camelCase(opts.name))}Input`,
    outputType: _.upperFirst(_.camelCase(opts.name)),
    ...opts,
  });

  const result = async (variables) => {
    console.log('calling result')
    const innerResult = await get(fn.name, variables);
    Object.defineProperty(innerResult, 'name', { value: fn.name });
    console.log('got result value', innerResult);
    return innerResult;
  };

  return result;
};
