"use strict";

var _ = require('lodash');

var expanded = require('./expanded');

module.exports = async function (definition, variables) {
  return _.pickBy((await expanded(definition)), function (_inputType, inputName) {
    return _.includes(_.keys(variables), inputName);
  });
};