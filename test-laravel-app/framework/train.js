const future = require('../../index');
const _ = require('lodash');
const brain = require('brain.js');

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

// const descriptionsWithLabels = _.map(descriptions, (description, i) => ({
//   description,
//   label: labels[i],
// }));

const train = (args) => {
  if (args.cache) {
    return args.cache;
  }
  const { descriptions, labels, output } = args;
  const net = new brain.recurrent.LSTM();
  // if (output.weights) net.fromJSON(output.weights);

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
    weights: JSON.stringify(net.toJSON()),
  };
};

module.exports = future.create(train, {
  cache: true, // true|false|'error'
  name: 'train',
  input: {
    // sounds: '[SoundWithTranscriptions]',
    // descriptionsWithLabels: '[DescriptionWithLabel]',
    descriptions: '[String]',
    labels: '[String]',
  },
  output: {
    weights: 'JSON',
  },
})({ descriptions, labels })
