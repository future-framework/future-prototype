const future = require('../../index');
const brain = require('brain.js');
const _ = require('lodash');

const train = require('./train')

const framework = ({ description, train: { weights } }) => {
  const net = new brain.recurrent.LSTM();
  net.fromJSON(JSON.parse(weights));

  const label = net.run(description);

  return {
    label,
  };
};

module.exports = future.create(framework, {
  name: 'framework',
  input: {
    train,
    description: 'String',
  },
  output: {
    label: 'String',
  },
});
