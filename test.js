const { ApolloClient } = require('apollo-client')
const { HttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const gql = require('graphql-tag')
const fetch = require('node-fetch')
const _ = require('lodash')
const brain = require('brain.js')
const serializer = require('./serializer');
const { GraphQLServer } = require('graphql-yoga')
const { everySeries } = require('p-iteration');

global.definedFunctions = {};

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

const future = (opts) => {
  return {
    and: function() {
      const functions = arguments;

      const result = (variables) => {
        _.each(functions, (fn) => {
          global.definedFunctions[fn.name] = (innerVariables) => {
            return fn(innerVariables);
          };
          if (!fn.name) {
            console.log(opts);
            console.log(fn);
            console.trace("I am here");
            console.log(resolverTypeDefs());
          }
        });

        global.definedFunctions[opts.name] = async (innerVariables) => {
          return everySeries(functions, async (fn) => {
            const serverResult = await queryServer(fn.name, innerVariables)
            return serverResult.data[fn.name];
          });
        };

        return global.definedFunctions[opts.name](variables);
      };

      Object.defineProperty(result, 'name', { value: opts.name });
      return result;
    },
  };
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

const queryServer = async (functionName, variables) => {
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
    query: gql`
      query($text: String!) {
        ${functionName}(text: $text)
      }
    `,
    variables,
  });
  await serverInstance.close();

  return result;
};

const run = async () => {
  const loves = ({ text }) => {
    return !!text.match(/love/);
  };

  const mentionsLaravel = ({ text }) => {
    return !!text.match(/laravel/);
  };

  const wantsToWorkWithLaravel = future({
    name: 'wantsToWorkWithLaravel',
  }).and(loves, mentionsLaravel);

  console.log('wantsToWorkWithLaravel "i love laravel"',
    await wantsToWorkWithLaravel({ text: 'i love laravel' }));

  const isFromVilnius = ({ text }) => {
    return text.match(/Vilnius/);
  };

  const wantsToWorkWithLaravelAndIsFromVilnius = future({
    name: 'wantsToWorkWithLaravelAndIsFromVilnius',
  }).and(wantsToWorkWithLaravel, isFromVilnius);

  console.log('wantsToWorkWithLaravelAndIsFromVilnius "i love laravel and Im from Kaunas"',
    await wantsToWorkWithLaravelAndIsFromVilnius({ text: 'i love laravel and Im from Kaunas' }));

  console.log('wantsToWorkWithLaravelAndIsFromVilnius "i love laravel and Im from Vilnius"',
    await wantsToWorkWithLaravelAndIsFromVilnius({ text: 'i love laravel and Im from Vilnius' }));
};

run()
