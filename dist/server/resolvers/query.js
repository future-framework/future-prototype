"use strict";

var _ = require('lodash');

var allDefinitions = require('../../definitions/all');

var saveCache = require('../../cache/save');

module.exports = async function () {
  return _.reduce(allDefinitions(), function (memo, definition) {
    memo[definition.name] = async function (_ctx, variables) {
      var resolveVariables = require('./resolveVariables');

      var resolvedVariables = await resolveVariables(definition, variables);
      var result = await definition.fn(resolvedVariables);
      saveCache(definition, result);
      return result;
    };

    return memo;
  }, {});
};