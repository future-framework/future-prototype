const _ = require('lodash')

module.exports = (definition) => {
  const result = [];

  _.each(definition.output, (val, key) => {
    result.push([`${key}: ${val}`]);
  });

  return result.join("\n");
};
