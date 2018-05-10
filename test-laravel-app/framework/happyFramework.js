const future = require('../../index');
const framework = require('./index');

const happyFramework = ({ description, framework: { label } }) => {
  return {
    happy: true,
  };
};

module.exports = future(happyFramework, {
  name: 'happyFramework',
  input: {
    framework: framework(),
    description: 'String',
  },
  output: {
    happy: 'Boolean',
  },
});
