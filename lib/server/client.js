const { ApolloClient } = require('apollo-client')
const { HttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')

module.exports = (port) => {
  const link = new HttpLink({
    uri: `http://localhost:${port}/`,
    fetch,
  });

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
};
