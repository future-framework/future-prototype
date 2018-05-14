const _ = require('lodash')

module.exports = (definition) => {
  let result = '';

  _.each(definition.output, (val, key) => {
    if (val == 'Bbox') {
      result += `
        bbox {
          left
          right
          top
          bottom
        }
      `;
    } else {
      result += `${key}\n`;
    }
  });

  return result;
}
