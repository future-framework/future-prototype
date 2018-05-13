const callsite = require('callsite')

module.exports = () => {
  try {
    return callsite()[2].getFileName()
  } catch(e) {
    return `future-${Math.random()}`;
  }
};
