"use strict";

var _ = require('lodash');

var _require = require('p-iteration'),
    forEach = _require.forEach;

var findDefinition = require('../../definitions/find');

var cacheContent = require('../../cache/content');

module.exports = async function (definition, variables) {
  var result = {};
  await forEach(_.keys(definition.input), async function (key) {
    var inputType = await definition.input[key];
    var dependency = findDefinition({
      inputType: inputType
    });
    if (!dependency) return;

    var get = require('../../get');

    result[key] = await get(dependency.name, variables);
  });

  if (definition.cache) {
    result.cache = cacheContent(definition);
  }

  return _.merge(result, variables);
};