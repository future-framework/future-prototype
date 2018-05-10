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

const train = ({ descriptions, labels, cache }) => {
  if (cache) return cache;

  const net = new brain.recurrent.LSTM();
  if (_.get(cache, 'weights')) net.fromJSON(JSON.parse(cache.weights));

  const data = _.map(descriptions, (description, i) => (
    {
      input: description,
      output: labels[i],
    }
  ));

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
    descriptions: '[String]',
    labels: '[String]',
  },
  output: {
    weights: 'JSON',
  },
})({ descriptions, labels })
