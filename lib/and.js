const _ = require('lodash')
const { everySeries } = require('p-iteration');

const get = require('./get');

module.exports = function() {
  const functions = arguments;

  _.each(functions, (fn) => {
    global.definitions[fn.name] = (innerVariables) => fn(innerVariables);
  });

  const result = (variables) => {
    global.definitions[opts.name] = async (innerVariables) => {
      return everySeries(functions, async (fn) => {
        return await get(fn.name, variables);
      });
    };

    return global.definitions[opts.name](variables);
  };

  Object.defineProperty(result, 'name', { value: opts.name });
  return result;
};
