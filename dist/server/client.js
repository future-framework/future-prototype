"use strict";

var _require = require('apollo-client'),
    ApolloClient = _require.ApolloClient;

var _require2 = require('apollo-link-http'),
    HttpLink = _require2.HttpLink;

var _require3 = require('apollo-cache-inmemory'),
    InMemoryCache = _require3.InMemoryCache;

var fetch = require('node-fetch');

module.exports = function (port) {
  var link = new HttpLink({
    uri: "http://localhost:".concat(port, "/"),
    fetch: fetch
  });
  return new ApolloClient({
    link: link,
    cache: new InMemoryCache()
  });
};