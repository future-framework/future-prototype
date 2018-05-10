"use strict";

var dir = require('./dir');

module.exports = function (fnFilename, opts) {
  return "".concat(dir(fnFilename), "/").concat(opts.name, "-cache.json");
};