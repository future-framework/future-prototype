const fs = require('fs')

module.exports = (definition) => {
  return fs.existsSync(definition.cacheFilename)
}
