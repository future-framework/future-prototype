const gql = require('graphql-tag')
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

  future().create(human);

  `{
    human(imageData: [321321])
    human(imageUrl: https)
  }`

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
  // await humanNetwork({ imageData })

  console.log(await queryServer({
    query: gql`
      query($image: Image!) {
        human(image: $image) {
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
