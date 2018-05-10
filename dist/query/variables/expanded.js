"use strict";

var _ = require('lodash');

var _require = require('p-iteration'),
    forEach = _require.forEach;

var findDefinition = require('../../definitions/find');

var allDependencies = require('../../dependencies/all');

module.exports = async function (definition) {
  var result = {};
  var dependencies = await allDependencies(definition);
  await forEach(_.keys(dependencies), async function (key) {
    var dependency = dependencies[key];

    var expanded = require('./expanded');

    var dependencyVariables = await expanded(dependency);
    await forEach(_.keys(dependencyVariables), async function (dependencyVariableKey) {
      result[dependencyVariableKey] = await dependencyVariables[dependencyVariableKey];
    });
  });
  result.cache = definition.inputType;
  return _.merge(result, definition.input);
};