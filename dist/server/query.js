"use strict";

var _ = require('lodash');

var _require = require('graphql-yoga'),
    GraphQLServer = _require.GraphQLServer;

var bodyParser = require('body-parser');

var typeDefs = require('./typeDefs/index');

var resolvers = require('./resolvers/index');

var client = require('./client');

var generatePort = function generatePort() {
  return _.random(4000, 5000);
};

module.exports = async function (_ref) {
  var query = _ref.query,
      variables = _ref.variables;
  var port = generatePort();
  var server = new GraphQLServer({
    typeDefs: await typeDefs(),
    resolvers: await resolvers()
  });
  server.express.use(bodyParser.json({
    limit: '50mb'
  }));
  server.express.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  }));
  var serverInstance = await server.start({
    port: port
  });
  var result;

  try {
    result = await client(port).query({
      query: query,
      variables: variables
    });
  } catch (e) {
    // console.log(variables);
    console.log(port);
    console.log('grahql', e.graphQLErrors);
    console.log('msg', e.message);
    console.log('netwerr', e.networkError);
    console.log(JSON.stringify(e.networkError.result));
    console.log('extra', e.extraInfo);
    console.trace('h');
    console.log(_.keys(e));
  }

  await serverInstance.close();
  return result;
};