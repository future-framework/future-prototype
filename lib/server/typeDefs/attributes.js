const _ = require('lodash')

module.exports = (opts) => {
  const result = [];

  _.each(opts, (val, key) => {
    result.push([`${key}: ${val}`]);
  });

  return result.join("\n");
};
