const gql = require('graphql-tag')
const _ = require('lodash');
const future = require('./index');
const brain = require('brain.js');
const sharp = require('sharp');
const Promise = require('bluebird');

const NUM = 40000

const run = async () => {
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
      iterations: 10,
    });

    return {
      weights: net.toJSON(),
    };
  };

  const framework = ({ description, train: { weights } }) => {
    // console.log(image);
    // console.log('wei', weights);
    const net = new brain.recurrent.LSTM();
    net.fromJSON(weights);

    const label = net.run(description);

    return {
      label,
    };
  };

  const cc = future().create(framework, {
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

  console.log(await cc({ description: descriptions[0] }));

  const trainSentiment = ({ descriptions, sentimentLabels, framework }) => {
    const net = new brain.recurrent.LSTM();

    const data = _.map(descriptions, (description, i) => (
      {
        input: description + framework({ description }).label,
        output: sentimentLabels[i],
      }
    ));

    console.log('data', JSON.stringify(data));

    net.train(data, {
      iterations: 10,
    });

    return {
      weights: net.toJSON(),
    };
  };


  const sentiment = ({ description, train: { weights } }) => {
    const net = new brain.recurrent.LSTM();
    net.fromJSON(weights);
    const label = net.run(description);

    return {
      label,
    };
  };

  const sentimentNetwork = future().create(sentiment, {
    name: 'sentiment',
    train: {
      fn: trainSentiment,
      variables: {
        descriptions,
        sentimentLabels,
      },
      input: {
        descriptions: '[String]',
        sentimentLabels: '[String]',
        framework: 'FrameworkInput',
      },
    },
    input: {
      description: 'String',
    },
    output: {
      label: 'String',
    },
  });

  console.log(await sentimentNetwork({ description: descriptions[0] }));

  const human = ({ image: { pixels } }) => {
    return {
      // pretend that some extraction of coords is happening from imageData
      // left bottom right top
      bbox: [100, 500, 700, 200],
    };
  };

  future().create(human, {
    name: 'human',
    input: {
      image: 'Image',
    },
    output: {
      bbox: '[Int]',
    }
  });

  const head = ({ human: { bbox }, image }) => {
    return {
      bbox: _.map(bbox, (point) => point + 1000),
    };
  };

  const headFn = future().create(head, {
    name: 'head',
    input: {
      human: 'HumanInput',
    },
    output: {
      bbox: '[Int]'
    },
  });

  const image = {
    pixels: [
      {
        r: 123,
        g: 111,
        b: 11,
      },
      {
        r: 199,
        g: 111,
        b: 119,
      },
    ],
  };

  // const returnedFunction = await headFn({ image });
  // console.log('returned function works', returnedFunction);
  //
  // const getFunction = await future().get('head', { image });
  // console.log('get function works', getFunction);
  //
  // console.log('query works', await future().query({
  //   query: gql`
  //     query($image: Image!) {
  //       head(image: $image) {
  //         bbox
  //       }
  //     }
  //   `,
  //   variables: {
  //     image,
  //   },
  // }));
};

run();
