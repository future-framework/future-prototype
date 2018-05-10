"use strict";

var _ = require('lodash');

var passedVariables = require('../variables/passed');

module.exports = async function (definition, variables) {
  var result = [];

  _.each((await passedVariables(definition, variables)), function (inputType, inputName) {
    result.push(["".concat(inputName, ": $").concat(inputName)]);
  });

  result.push(["cache: $cache"]);
  return result.join(', ');
};