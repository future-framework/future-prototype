const _ = require('lodash')
const { GraphQLServer } = require('graphql-yoga')
const bodyParser = require('body-parser');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const client = require('./client');

const generatePort = () => {
  return _.random(4000, 5000);
};

module.exports = async ({ query, variables }) => {
  const port = generatePort();
  const server = new GraphQLServer({ typeDefs: typeDefs(), resolvers: await resolvers() })
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
    console.log(e.graphQLErrors);
    console.log(e.message);
    console.trace('h')
    console.log(_.keys(e));
  }

  await serverInstance.close();

  return result;
};
