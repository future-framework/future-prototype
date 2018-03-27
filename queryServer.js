const { ApolloClient } = require('apollo-client')
const { HttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const { GraphQLServer } = require('graphql-yoga')
const fetch = require('node-fetch')
const _ = require('lodash')

const client = (port) => {
  const link = new HttpLink({
    uri: `http://localhost:${port}/`,
    fetch,
  });

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
};

const generatePort = () => {
  return _.random(4000, 5000);
};

const transformedResolvers = () => {
  return _.reduce(global.definedFunctions, (result, resolverFn, key) => {
    result[key] = (_, variables) => resolverFn(variables);
    return result;
  }, {});
};

const resolverTypeDefs = () => {
  return _.reduce(global.definedFunctions, (result, resolverFn, key) => {
    result += `${key}(text: String!): Boolean\n`;
    return result;
  }, '');
};


module.exports = async ({ query, variables }) => {
  const typeDefs = `
    type Query {
      ${resolverTypeDefs()}
    }
  `

  const resolvers = {
    Query: transformedResolvers(),
  }

  const port = generatePort();
  const server = new GraphQLServer({ typeDefs, resolvers })
  const serverInstance = await server.start({
    port,
  });

  const result = await client(port).query({
    query,
    variables,
  });

  await serverInstance.close();

  return result;
};
