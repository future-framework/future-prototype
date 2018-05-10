"use strict";

var path = require('path');

module.exports = function (filename) {
  return path.dirname(filename);
};