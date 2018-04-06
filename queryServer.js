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
  const result = {};

  _.each(global.definedFunctions, (fn) => {
    result[fn.name] = (_a, variables) => {
      if (!fn.dependencyName) return fn.fn(variables);

      const dependency = _.find(global.definedFunctions, { name: fn.dependencyName });
      const dependencyResult = dependency.fn(variables);
      return fn.fn(_.merge({ [fn.dependencyName]: dependencyResult }, variables));
    };
  });

  return result;
};

const resolverTypeDefs = () => {
  let result = '';

  _.each(global.definedFunctions, (fn) => {
    result += `${fn.name}(${fn.inputType}): ${fn.payloadType}\n`;
  });

  return result;
};


module.exports = async ({ query, variables }) => {
  const typeDefs = `
    type Query {
      ${resolverTypeDefs()}
    }

    input Image {
      pixels: [Pixel!]!
    }

    input Pixel {
      r: Int!
      g: Int!
      b: Int!
    }

    type HumanPayload {
      bbox: [Int!]!
    }

    type HeadPayload {
      bbox: [Int!]!
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
  console.log(port);
  // const port

  let result;

  try {
    result = await client(port).query({
      query,
      variables,
    });
  } catch(e) {
    console.log(e.graphQLErrors);
    console.log(e.message);
    console.trace('h')
    console.log(_.keys(e));
  }

  await serverInstance.close();

  return result;
};
