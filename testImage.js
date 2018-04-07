const gql = require('graphql-tag')
const _ = require('lodash');
const future = require('./index');
const queryServer = require('./queryServer');

const run = async () => {
  const human = ({ imageData }) => {
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
    console.log('from head, hjma bbox', bbox)
    console.log('image in head', image)
    return {
      bbox: _.map(bbox, (point) => point + 1000),
    };
  };

  const headFn = future().create(head, {
    name: 'head',
    input: {
      human: 'humanInput',
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

  const f = await headFn({ image });
  console.log('ffff', f);

  const headResult = await future().get('head', { image });
  console.log('hr',headResult);

  // const headResult = await future().get({
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
  // });
};

run();
