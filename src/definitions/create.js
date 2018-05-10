const _ = require('lodash')

module.exports = (definition) => {
  global.definitions = _.clone(global.definitions).concat(definition);
  return definition;
}
