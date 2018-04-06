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

  future().create(human, 'image: Image!', 'HumanPayload');

  const head = ({ human: { bbox }, image }) => {
    console.log('from head, hjma bbox', bbox)
    console.log('image in head', image)
    return {
      // pretend that some extraction of coords is happening from imageData
      // left bottom right top
      bbox: _.map(bbox, (point) => point + 1000),
    };
  };
  future().create(head, 'image: Image!', 'HeadPayload', 'human');

  // TODO: make it so you dont have to initialize the network with this network
  // call but could use it upon definition on future()..;
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

  console.log(JSON.stringify(await queryServer({
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
  })));
};

run();
