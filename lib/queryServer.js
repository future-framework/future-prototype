const { ApolloClient } = require('apollo-client')
const { HttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const { GraphQLServer } = require('graphql-yoga')
const fetch = require('node-fetch')
const _ = require('lodash')

const allDefinitions = require('./definitions/all');
const findDefinition = require('./definitions/find');
const typeDefinitionInputTypes = require('./typeDefinitionInputTypes');

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

  _.each(allDefinitions(), (definition) => {
    result[definition.name] = (_a, variables) => {
      if (_.isEmpty(definition.input)) return definition.fn(variables);

      const dependencyResult = {};

      _.each(definition.input, (val, key) => {
        const dependency = findDefinition({ inputType: val });
        dependencyResult[key] = dependency.fn(variables);
      });

      return definition.fn(_.merge(dependencyResult, variables));
    };
  });

  return result;
};

const outputTypes = (definition) => {
  const result = [];

  _.each(definition.output, (val, key) => {
    result.push([`${key}: ${val}`]);
  });

  return result.join(', ');
};

const resolverTypeDefs = () => {
  let result = '';

  _.each(allDefinitions(), (definition) => {
    result += `${definition.name}(${typeDefinitionInputTypes(definition.name)}): ${definition.outputType}\n`;
  });

  return result;
};

const attributeTypes = (definition) => {
  const result = [];

  _.each(definition.output, (val, key) => {
    result.push([`${key}: ${val}`]);
  });

  return result.join("\n");
};

const types = () => {
  let result = '';

  _.each(allDefinitions(), (definition) => {
    result += `
      type ${definition.outputType} {
        ${attributeTypes(definition)}
      }\n
      input ${definition.inputType} {
        ${attributeTypes(definition)}
      }\n
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
      r: [Float!]!
      g: [Float!]!
      b: [Float!]!
    }

    input Pixel {
      r: Int!
      g: Int!
      b: Int!
    }

    ${types()}

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
