const future = require('../../index');
const brain = require('brain.js');
const _ = require('lodash');

const descriptions = [
  'i like laravel',
  'i work with laravel',
  'i do this',
];

const frameworkLabels = [
  'laravel',
  'laravel',
  'no',
];

const trainFramework = ({ descriptions, frameworkLabels }) => {
  const net = new brain.recurrent.LSTM();

  const data = _.map(descriptions, (description, i) => (
    {
      input: description,
      output: frameworkLabels[i],
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
    fn: trainFramework,
    variables: {
      descriptions,
      frameworkLabels,
    },
    input: {
      descriptions: '[String]',
      frameworkLabels: '[String]',
    },
  },
  input: {
    description: 'String',
  },
  output: {
    label: 'String',
  },
});
