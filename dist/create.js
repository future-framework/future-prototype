"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ = require('lodash');

var fs = require('fs');

var createDefinition = require('./definitions/create');

var getFilename = require('./getFilename');

var cacheFilename = require('./cache/filename');

var findDefinition = require('./definitions/find');

var typifyInput = function typifyInput(input) {
  var result = {};

  _.each(input, function (inputType, key) {
    if (inputType.futureName) {
      var definition = findDefinition({
        name: inputType.futureName
      });
      result[key] = definition.inputType;
    } else {
      result[key] = inputType;
    }
  });

  return result;
};

module.exports = function (fn, opts) {
  var definition = createDefinition(_objectSpread({
    fn: fn,
    filename: getFilename(),
    cacheFilename: cacheFilename(getFilename(), opts),
    inputType: "".concat(_.upperFirst(_.camelCase(opts.name)), "Input"),
    outputType: _.upperFirst(_.camelCase(opts.name))
  }, opts, {
    input: typifyInput(opts.input)
  }));

  var result = function result(variables) {
    var get = require('./get');

    var innerResult = get(definition.name, variables);
    Object.defineProperty(innerResult, 'futureName', {
      value: definition.name
    });
    return innerResult;
  };

  Object.defineProperty(result, 'name', {
    value: fn.name
  });
  Object.defineProperty(result, 'definition', {
    value: definition
  });
  return result;
};