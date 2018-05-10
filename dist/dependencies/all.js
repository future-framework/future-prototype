"use strict";

var _ = require('lodash');

var _require = require('p-iteration'),
    forEach = _require.forEach;

var findDefinition = require('../definitions/find');

module.exports = async function (definition) {
  var result = {};
  await forEach(_.keys(definition.input), async function (key) {
    var inputType = definition.input[key];
    var dependency = findDefinition({
      inputType: inputType
    });
    if (!dependency) return;
    result[key] = dependency;
  });
  return result;
};