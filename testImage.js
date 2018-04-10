const gql = require('graphql-tag')
const _ = require('lodash');
const future = require('./index');
const brain = require('brain.js');

const run = async () => {
  const images = [
    { pixels: [{ r: 0.03, g: 0.7, b: 0.5 }] },
    { pixels: [{ r: 0.16, g: 0.09, b: 0.2 }] },
    { pixels: [{ r: 0.5, g: 0.5, b: 1.0 }] },
  ];

  const imageLabels = [
    { black: 1 },
    { white: 1 },
    { white: 1 },
  ];

  const train = ({ images, imageLabels }) => {
    console.log('training on images', { images, imageLabels });
    const net = new brain.NeuralNetwork();

    const data = _.map(images, (image, i) => (
      {
        input: image.pixels[0],
        output: imageLabels[i],
      }
    ));

    console.log('data', JSON.stringify(data));

    net.train(data);

    return {
      weights: net.toJSON(),
    };
  };

  const colorContrast = ({ image, train: { weights } }) => {
    console.log(image);
    console.log('wei', weights);
    const net = new brain.NeuralNetwork();
    net.fromJSON(weights);

    console.log(net.run(image.pixels[0]).black);
    return {
      value: net.run(image.pixels[0]).black,
    };
  };

  const cc = future().create(colorContrast, {
    name: 'colorContrast',
    train: {
      fn: train,
      data: {
        images,
        imageLabels,
      },
      input: {
        images: '[Image]',
        imageLabels: '[ImageLabel]',
      },
    },
    input: {
      image: 'Image',
    },
    output: {
      value: 'Float',
    },
  });

  console.log(await cc({ image: images[0] }));
  console.log(await cc({ image: images[1] }));
  console.log(await cc({ image: images[2] }));

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

  const returnedFunction = await headFn({ image });
  console.log('returned function works', returnedFunction);

  const getFunction = await future().get('head', { image });
  console.log('get function works', getFunction);

  console.log('query works', await future().query({
    query: gql`
      query($image: Image!) {
        head(image: $image) {
          bbox
        }
      }
    `,
    variables: {
      image,
    },
  }));
};

run();
