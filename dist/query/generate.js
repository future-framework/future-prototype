"use strict";

var _ = require('lodash');

var queryArgs = require('./args/query');

var functionArgs = require('./args/function');

var outputAttributes = require('./output/attributes');

module.exports = async function (definition, variables) {
  return "\n    query(".concat((await queryArgs(definition, variables)), ") {\n      ").concat(definition.name, "(").concat((await functionArgs(definition, variables)), ") {\n        ").concat(outputAttributes(definition).join("\n"), "\n      }\n    }\n  ");
};