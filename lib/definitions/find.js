const _ = require('lodash')

module.exports = (opts) => _.find(global.definitions, opts);
