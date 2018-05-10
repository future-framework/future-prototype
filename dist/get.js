"use strict";

var _ = require('lodash');

var gql = require('graphql-tag');

var findDefinition = require('./definitions/find');

var generateQuery = require('./query/generate');

module.exports = async function (name, variables) {
  var definition = findDefinition({
    name: name
  });

  if (!definition) {
    console.log(definitions);
    throw "Definition for ".concat(name, " missing.");
  }

  var query = gql((await generateQuery(definition, variables)));

  var serverQuery = require('./server/query');

  var serverResult = await serverQuery({
    query: query,
    variables: variables
  });
  return _.omit(_.get(serverResult, "data.".concat(definition.name)), '__typename');
};