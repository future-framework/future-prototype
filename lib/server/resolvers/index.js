const GraphQLJSON = require('graphql-type-json')
const query = require('./query');

module.exports = async () => ({
  Query: await query(),
  JSON: GraphQLJSON,
});
