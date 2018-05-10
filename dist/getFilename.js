"use strict";

var callsite = require('callsite');

module.exports = function () {
  try {
    return callsite()[2].getFileName();
  } catch (e) {
    return "future-".concat(Math.random());
  }
};