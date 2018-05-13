const fs = require('fs')
const _ = require('lodash')

module.exports = (definition, data) => {
  if (!definition.cache) return;

  fs.writeFileSync(definition.cacheFilename, JSON.stringify(_.omit(data, '__typename'), null, 2), 'utf8');
};
