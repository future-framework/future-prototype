const _ = require('lodash')
const { everySeries } = require('p-iteration');
const gql = require('graphql-tag')
const queryServer = require('./queryServer');

global.definedFunctions = [];

const queryServerFunction = async (functionName, variables) => {
  return queryServer({
    query: gql`
      query($text: String!) {
        ${functionName}(text: $text)
      }
    `,
    variables,
  });
};

module.exports = (opts) => {
  return {
    and: function() {
      const functions = arguments;

      _.each(functions, (fn) => {
        global.definedFunctions[fn.name] = (innerVariables) => fn(innerVariables);
      });

      const result = (variables) => {
        global.definedFunctions[opts.name] = async (innerVariables) => {
          return everySeries(functions, async (fn) => {
            const serverResult = await queryServerFunction(fn.name, innerVariables)
            return serverResult.data[fn.name];
          });
        };

        return global.definedFunctions[opts.name](variables);
      };

      Object.defineProperty(result, 'name', { value: opts.name });
      return result;
    },
    create: function(fn, inputType, payloadType, dependencyName) {
      global.definedFunctions.push({
        name: fn.name,
        dependencyName,
        inputType,
        payloadType,
        fn: (innerVariables) => fn(innerVariables),
      });

      const result = async (variables) => {
        const serverResult = await queryServerFunction(fn.name, variables)
        return serverResult.data[fn.name];
      };

      Object.defineProperty(result, 'name', { value: fn.name });
      return result;
    },
  };
};
