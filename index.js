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

const get = async function(name, variables) {
  const definedFunction = _.find(global.definedFunctions, { name });
  const outputAttributes = _.keys(definedFunction.output);

  const inputTypes = (fn) => {
    const result = [];

    _.each(fn.input, (val, key) => {
      if (_.includes(_.keys(variables), key)) result.push([`$${key}: ${val}`]);

      const dependency = _.find(global.definedFunctions, { name: val.replace(/Input$/, '') });

      if (!dependency) return;

      _.each(dependency.input, (depVal, depKey) => {
        if (_.includes(_.keys(variables), depKey)) result.push([`$${depKey}: ${depVal}`]);
      });
    });

    return result.join(', ');
  };

  const functionArgs = 'image: $image';

  const query = gql`
    query(${inputTypes(definedFunction)}) {
      ${name}(${functionArgs}) {
        ${outputAttributes.join("\n")}
      }
    }
  `;

  const result = await queryServer({
    query,
    variables,
  });

  return _.get(result, 'data');
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
    create: function(fn, opts) {
      global.definedFunctions.push({
        fn: (innerVariables) => fn(innerVariables),
        ...opts,
      });

      const result = async (variables) => {
        return await get(fn.name, variables);
      };

      Object.defineProperty(result, 'name', { value: fn.name });
      return result;
    },
    get,
  };
};
