"use strict";

var query = require('./query');

var functionInputsOutputs = require('./functionInputsOutputs');

module.exports = async function () {
  return "\n    type Query {\n      ".concat((await query()), "\n    }\n\n    input Image {\n      pixels: [Int!]!\n    }\n\n    input Pixel {\n      r: Float!\n      g: Float!\n      b: Float!\n    }\n\n    scalar JSON\n\n    ").concat(functionInputsOutputs(), "\n  ");
};