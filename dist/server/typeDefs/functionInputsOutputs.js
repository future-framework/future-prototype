"use strict";

var _ = require('lodash');

var allDefinitions = require('../../definitions/all');

var attributes = require('./attributes');

module.exports = function () {
  var result = '';

  _.each(allDefinitions(), function (definition) {
    result += "\n      type ".concat(definition.outputType, " {\n        ").concat(attributes(definition), "\n      }\n\n      input ").concat(definition.inputType, " {\n        ").concat(attributes(definition), "\n      }\n\n    ");
  });

  return result;
};