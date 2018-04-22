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

const train = ({ descriptions, labels, cache }) => {
  if (cache) return cache;

  const net = new brain.recurrent.LSTM();
  console.log(_.keys(cache))
  if (cache.weights) net.fromJSON(JSON.parse(cache.weights));

  const data = _.map(descriptions, (description, i) => (
    {
      input: description,
      output: labels[i],
    }
  ));

  console.log('data', JSON.stringify(data));

  if (data.length) {
    net.train(data, {
      iterations: 1000,
    });
  }

  return {
    weights: JSON.stringify(net.toJSON()),
  };
};

module.exports = future(train, {
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
