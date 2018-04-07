const _ = require('lodash')
const findDefinition = require('./definitions/find');

module.exports = (name, variables) => {
  const definition = findDefinition(name, variables);
  const result = [];

  _.each(definition.input, (val, key) => {
    if (_.includes(_.keys(variables), key)) result.push([`$${key}: ${val}`]);

    const dependency = findDefinition(val.replace(/Input$/, ''));
    if (!dependency) return;

    _.each(dependency.input, (depVal, depKey) => {
      if (_.includes(_.keys(variables), depKey)) result.push([`$${depKey}: ${depVal}`]);
    });
  });

  return result.join(', ');
};
