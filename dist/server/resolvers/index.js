"use strict";

var GraphQLJSON = require('graphql-type-json');

var query = require('./query');

module.exports = async function () {
  return {
    Query: await query(),
    JSON: GraphQLJSON
  };
};