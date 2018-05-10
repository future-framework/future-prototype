"use strict";

var fs = require('fs');

var cacheExists = require('./exists');

module.exports = function (definition) {
  if (!cacheExists(definition)) return;
  return JSON.parse(fs.readFileSync(definition.cacheFilename, 'utf8'));
};