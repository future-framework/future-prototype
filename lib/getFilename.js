const callsite = require('callsite')

module.exports = () => {
  return callsite()[2].getFileName()
};
