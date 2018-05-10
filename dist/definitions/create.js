"use strict";

var _ = require('lodash');

module.exports = function (definition) {
  global.definitions = _.clone(global.definitions).concat(definition);
  return definition;
};