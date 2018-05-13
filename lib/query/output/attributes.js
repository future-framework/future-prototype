const _ = require('lodash')

module.exports = (definition) => {
  return _.keys(definition.output);
}
