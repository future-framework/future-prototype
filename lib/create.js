const _ = require('lodash')
const fs = require('fs');

const createDefinition = require('./definitions/create');
const getFilename = require('./getFilename');
const cacheFilename = require('./cache/filename');
const allDependencies = require('./dependencies/all')

module.exports = function(fn, opts) {
  createDefinition({
    fn,
    filename: getFilename(),
    cacheFilename: cacheFilename(getFilename(), opts),
    inputType: `${_.upperFirst(_.camelCase(opts.name))}Input`,
    outputType: _.upperFirst(_.camelCase(opts.name)),
    dependencies: allDependencies(opts),
    ...opts,
  });

  const result = (variables) => {
    const get = require('./get');
    return get(fn.name, variables);
  };

  return result;
};
