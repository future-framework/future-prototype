const fs = require('fs')
const cacheExists = require('./exists')

module.exports = (definition) => {
  if (!cacheExists(definition)) return;

  return JSON.parse(fs.readFileSync(definition.cacheFilename, 'utf8'));
};
