"use strict";

var _ = require('lodash');

module.exports = function (definition) {
  return _.keys(definition.output);
};