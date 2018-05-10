"use strict";

var _ = require('lodash');

var expandedVariables = require('../../query/variables/expanded');

module.exports = async function (definition) {
  var result = _.map((await expandedVariables(definition)), function (inputType, inputName) {
    return "".concat(inputName, ": ").concat(inputType);
  });

  return result.join(', ');
};