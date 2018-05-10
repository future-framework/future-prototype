"use strict";

var _ = require('lodash');

var _require = require('p-iteration'),
    everySeries = _require.everySeries;

var get = require('./get');

module.exports = function () {
  var functions = arguments;

  _.each(functions, function (fn) {
    global.definitions[fn.name] = function (innerVariables) {
      return fn(innerVariables);
    };
  });

  var result = function result(variables) {
    global.definitions[opts.name] = async function (innerVariables) {
      return everySeries(functions, async function (fn) {
        return await get(fn.name, variables);
      });
    };

    return global.definitions[opts.name](variables);
  };

  Object.defineProperty(result, 'name', {
    value: opts.name
  });
  return result;
};