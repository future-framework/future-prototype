const fs = require('fs')

module.exports = (definition) => {
  return JSON.parse(fs.readFileSync(definition.cacheFilename, 'utf8'));
};
