const gql = require('graphql-tag')
const _ = require('lodash');
const future = require('../index');
const brain = require('brain.js');
const sharp = require('sharp');
const Promise = require('bluebird');

const framework = require('./framework/index');

const NUM = 40000

const run = async () => {
  const descriptions = [
    'i like laravel',
    'i work with laravel',
    'i do this',
  ];

  const sentimentLabels = [
    'like',
    'like',
    'neutral',
  ];

  const workLabels = [
    'work',
    'work',
    'no',
  ];

  console.log('frame', await framework({ description: descriptions[0] }));

  // const trainSentiment = ({ descriptions, sentimentLabels, framework }) => {
  //   const net = new brain.recurrent.LSTM();
  //
  //   const data = _.map(descriptions, (description, i) => (
  //     {
  //       input: description + framework({ description }).label,
  //       output: sentimentLabels[i],
  //     }
  //   ));
  //
  //   console.log('data', JSON.stringify(data));
  //
  //   net.train(data, {
  //     iterations: 10,
  //   });
  //
  //   return {
  //     weights: net.toJSON(),
  //   };
  // };
  //
  //
  // const sentiment = ({ description, train: { weights } }) => {
  //   const net = new brain.recurrent.LSTM();
  //   net.fromJSON(weights);
  //   const label = net.run(description);
  //
  //   return {
  //     label,
  //   };
  // };
  //
  // const sentimentNetwork = future.create(sentiment, {
  //   name: 'sentiment',
  //   train: {
  //     fn: trainSentiment,
  //     variables: {
  //       descriptions,
  //       sentimentLabels,
  //     },
  //     input: {
  //       descriptions: '[String]',
  //       sentimentLabels: '[String]',
  //       framework: 'FrameworkInput',
  //     },
  //   },
  //   input: {
  //     description: 'String',
  //   },
  //   output: {
  //     label: 'String',
  //   },
  // });
  //
  // console.log(await sentimentNetwork({ description: descriptions[0] }));
};

run();
