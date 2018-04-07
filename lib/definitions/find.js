const _ = require('lodash')

module.exports = (name) => _.find(global.definitions, { name });
