const GraphQLJSON = require('graphql-type-json')
const queryResolvers = require('./queryResolvers');

module.exports = async () => ({
  Query: await queryResolvers(),
  JSON: GraphQLJSON,
});
