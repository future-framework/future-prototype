"use strict";

var fs = require('fs');

module.exports = function (definition) {
  return fs.existsSync(definition.cacheFilename);
};