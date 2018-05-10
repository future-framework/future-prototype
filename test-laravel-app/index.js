const gql = require('graphql-tag')
const _ = require('lodash');
const future = require('../index');
const brain = require('brain.js');
const sharp = require('sharp');

const framework = require('./framework/index');
const happyFramework = require('./framework/happyFramework');

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
  console.log('happy', await happyFramework({ description: descriptions[0] }));

  // `
  //   framework(description: $description) {
  //     label
  //   }
  //   `
};

run();
