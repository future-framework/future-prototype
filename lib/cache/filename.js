const dir = require('./dir');

module.exports = (fnFilename, opts) => {
  return `${dir(fnFilename)}/${opts.name}-cache.json`;
};
