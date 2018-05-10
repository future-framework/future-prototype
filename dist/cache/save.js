"use strict";

var fs = require('fs');

var _ = require('lodash');

module.exports = function (definition, data) {
  if (!definition.cache) return;
  fs.writeFileSync(definition.cacheFilename, JSON.stringify(_.omit(data, '__typename'), null, 2), 'utf8');
};