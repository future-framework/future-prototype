const gql = require('graphql-tag')
const _ = require('lodash');
const future = require('./index');

const run = async () => {
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
