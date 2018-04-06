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
      if (_.isEmpty(fn.input)) return fn.fn(variables);

      const dependencyResult = {};

      _.each(fn.input, (val, key) => {
        const dependency = _.find(global.definedFunctions, { name: val.replace(/Input$/, '') });
        dependencyResult[key] = dependency.fn(variables);
      });

      return fn.fn(_.merge(dependencyResult, variables));
    };
  });

  return result;
};

const inputTypes = (fn) => {
  const result = [];

  _.each(fn.input, (val, key) => {
    result.push([`${key}: ${val}`]);

    const dependency = _.find(global.definedFunctions, { name: val.replace(/Input$/, '') });

    if (!dependency) return;

    _.each(dependency.input, (depVal, depKey) => {
      result.push([`${depKey}: ${depVal}`]);
    });
  });

  return result.join(', ');
};

const outputTypes = (fn) => {
  const result = [];

  _.each(fn.output, (val, key) => {
    result.push([`${key}: ${val}`]);
  });

  return result.join(', ');
};

const resolverTypeDefs = () => {
  let result = '';

  _.each(global.definedFunctions, (fn) => {
    result += `${fn.name}(${inputTypes(fn)}): ${fn.name}Payload\n`;
  });

  return result;
};

const attributeTypes = (fn) => {
  const result = [];

  _.each(fn.output, (val, key) => {
    result.push([`${key}: ${val}`]);
  });

  return result.join("\n");
};

const types = () => {
  let result = '';

  _.each(global.definedFunctions, (fn) => {
    result += `
      type ${fn.name}Payload {
        ${attributeTypes(fn)}
      }\n\n
      input ${fn.name}Input {
        ${attributeTypes(fn)}
      }\n\n
    `;
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

    ${types()}

  `

  console.log(typeDefs);
    // type Human {
    //   bbox: [Int!]!
    // }
    //
    // type Head {
    //   bbox: [Int!]!
    // }

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
