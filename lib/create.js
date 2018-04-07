const get = require('./get');
const createDefinition = require('./definitions/create');

module.exports = function(fn, opts) {
  createDefinition({
    fn: (innerVariables) => fn(innerVariables),
    ...opts,
  });

  const result = async (variables) => {
    return await get(fn.name, variables);
  };

  Object.defineProperty(result, 'name', { value: fn.name });
  return result;
};
