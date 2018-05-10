"use strict";

var _ = require('lodash');

var _require = require('p-iteration'),
    map = _require.map;

var allDefinitions = require('../../definitions/all');

var args = require('./args');

module.exports = async function () {
  var result = await map(allDefinitions(), async function (definition) {
    return "".concat(definition.name, "(").concat((await args(definition)), "): ").concat(definition.outputType);
  });
  return result.join("\n");
};