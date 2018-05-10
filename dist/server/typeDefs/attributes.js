"use strict";

var _ = require('lodash');

module.exports = function (definition) {
  var result = [];

  _.each(definition.output, function (val, key) {
    result.push(["".concat(key, ": ").concat(val)]);
  });

  return result.join("\n");
};