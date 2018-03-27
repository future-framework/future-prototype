const { ApolloClient } = require('apollo-client')
const { HttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const gql = require('graphql-tag')
const fetch = require('node-fetch')
const _ = require('lodash')
const brain = require('brain.js')
const serializer = require('./serializer');

const link = new HttpLink({
  uri: 'http://localhost:4000/',
  fetch,
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

const runTest = async () => {
  const result = await client.query({
    query: gql`{
      hello
    }`
  })
  console.log(result)
}

const chooseNetwork = (samples, labels) => {
  return new brain.NeuralNetwork()
  // if (_.isString(samples[0])) return new brain.recurrent.LSTM();
  // if (_.isNumber(samples[0])) return new brain.NeuralNetwork();

  throw 'Cant choose net';
};

const fNetworks = {};

const f = {
  get: async (object, path) => {
    if (_.hasIn(object, path)) return _.get(object, path);
    const pathParts = path.split('.');
    const attribute = _.last(pathParts);

    if (fNetworks[path]) return fNetworks[path].run(serializer.encode(_.get(object, attribute)));

    const keys = _.dropRight(pathParts);


    return client.query({
      query: gql`
        {
          ${_.map(keys, (key, i) => `${_.repeat('  ', i)}${key} {\n`)}
            ${attribute}
          ${_.map(keys, (key, i) => `${_.repeat('  ', i)}}\n`)}
        }
      `,
    });
  },
  map: async (collection, fn, opts) => {
    const data = _.map(collection, (item) => ({
      input: item,
      output: fn(item),
    }));

    const net = chooseNetwork(collection, data);

    const serialized = serializer.serialize(data);
    net.train(serialized, { iterations: 1000 });

    fNetworks[opts.name] = net;

    return _.map(collection, async (item) => await f.get(item, opts.name));
  },
};

const run = async () => {
  const descriptions = [
    'no laravel',
    'laravel',
    'laraaaaaa',
    'laravel is cool',
    'laravel is baaaaad',
    'I like you',
    'hey nope',
    'dude',
    'i hate laravel',
    'laravrl sucks'
  ];

  worksWithLaravel = future.train('worksWithLaravel', descriptions, (description) => {
    return description.match('laravel') && sentimentPositive;
    // return description.match('laravel')
  });
  user.worksWithLaravel = sentimentPositive // filter(description.match('laravel'))§
  worksWithLaravelDesc = future.join('sentiment(positive: true)', 'topic(value: "laravel")', {
    text: user.description
  })

  import sentiment from '@future/sentiment';
  worksWithLaravelSummary = future.join(sentiment(positive: true), topic(value: "laravel"), {
    text: user.summary
  })

  customCheck = (age) => {
    LSTME.predict(age);
    // return age > 18;
  }

  user.worksWithLaravel= future.join(worksWithLaravelDesc, worksWithLaravelSummary, customCheck);

  user.worksWithLaravel => true

  // const laravelDescriptions = await f.map(descriptions, (description) => (
  //   { result: description.match('laravel') ? 1 : 0 }
  // ), { name: 'laravel.score.description', network: LSTM });
  // console.log(laravelDescriptions);

  const user = {
    name: 'John',
    description: 'I must do laravel'
  };

  try {
    `
      laravel {
        score {
          description(s

          title(s
          time {
          }
        }
      }

      laravelScoreDescription(description: $description) {
        result
      }

      laravelScoreTitle(description: $description) {
        result
      }
    `
    const result = await f.get(user, 'laravel.score.description');
    const result = await f.get({ imageUrl: 'aaa' }, 'eyes.bbox');
    console.log(result);
  } catch(e) {
    console.log(e);
  }

  const imageUrl = 'https';
  `
    {
      blogPost($blogPost: BlogPost!) {
        $createdAt: createdAt

        time(value: $createdAt) {
          weekday
        }
      }

      [
        { bbox: [31231] },
        {
          bbox: [31231],
          sexes: [
          ]
          heads: [
            {
              eyes: [
              ]
            },
          ],
        },
      ]

      humans(imageUrl: $imageUrl) {
        $bbox: bbox

        sexes {
          value
        }

        heads(imageUrl ..., index) {
          bbox

          eyes {
            bbox
            isLeft
            isRight
          }
        }
      }

      eyes(imageUrl: $imageUrl) {
        color
        isLeft
      }
    }
  `
};

run()
