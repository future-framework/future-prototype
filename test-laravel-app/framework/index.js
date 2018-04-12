const future = require('../../index');
const brain = require('brain.js');
const _ = require('lodash');

const descriptions = [
  'i like laravel',
  'i work with laravel',
  'i do this',
];

const labels = [
  'laravel',
  'laravel',
  'no',
];

const train = ({ descriptions, labels }) => {
  const net = new brain.recurrent.LSTM();

  const data = _.map(descriptions, (description, i) => (
    {
      input: description,
      output: labels[i],
    }
  ));

  console.log('data', JSON.stringify(data));

  net.train(data, {
    iterations: 1000,
  });

  return {
    weights: net.toJSON(),
  };
};

const framework = ({ description, train: { weights } }) => {
  const net = new brain.recurrent.LSTM();
  net.fromJSON(weights);

  const label = net.run(description);

  return {
    label,
  };
};

module.exports = future.create(framework, {
  name: 'framework',
  train: {
    fn: train,
    variables: {
      descriptions,
      labels,
    },
    input: {
      descriptions: '[String]',
      labels: '[String]',
    },
  },
  input: {
    description: 'String',
  },
  output: {
    label: 'String',
  },
});
