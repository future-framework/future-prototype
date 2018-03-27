const _ = require('lodash')
const { everySeries } = require('p-iteration');
const gql = require('graphql-tag')
const queryServer = require('./queryServer');

global.definedFunctions = {};

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

      const result = (variables) => {
        _.each(functions, (fn) => {
          global.definedFunctions[fn.name] = (innerVariables) => fn(innerVariables);
        });

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
  };
};
