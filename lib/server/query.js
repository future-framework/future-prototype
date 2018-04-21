const _ = require('lodash')
const { GraphQLServer } = require('graphql-yoga')
const bodyParser = require('body-parser');

const typeDefs = require('./typeDefs/index');
const getResolvers = require('./getResolvers');
const client = require('./client');

const generatePort = () => {
  return _.random(4000, 5000);
};

module.exports = async ({ query, variables }) => {
  const port = generatePort();
  const resolvers = await getResolvers();
  console.log('typeDefs -----', await typeDefs())

  const server = new GraphQLServer({ typeDefs: await typeDefs(), resolvers })
  server.express.use(bodyParser.json({limit: '50mb'}));
  server.express.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  const serverInstance = await server.start({
    port,
  });

  let result;

  try {
    result = await client(port).query({
      query,
      variables,
    });
  } catch(e) {
    // console.log(variables);
    console.log(port);
    console.log('grahql', e.graphQLErrors);
    console.log('msg', e.message);
    console.log('netwerr', e.networkError);
    console.log(JSON.stringify(e.networkError.result))
    console.log('extra', e.extraInfo);
    console.trace('h')
    console.log(_.keys(e));
  }

  await serverInstance.close();

  return result;
};
