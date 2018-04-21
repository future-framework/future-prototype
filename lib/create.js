const _ = require('lodash')
const fs = require('fs');

const createDefinition = require('./definitions/create');
const findDefinition = require('./definitions/find');
const getFilename = require('./getFilename');
const cacheFilename = require('./cache/filename');

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
    const get = require('./get');
    const innerResult = get(fn.name, variables);
    return innerResult;
  };

  return result;
};
