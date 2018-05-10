"use strict";

var _ = require('lodash');

module.exports = function (opts) {
  return _.find(global.definitions, opts);
};