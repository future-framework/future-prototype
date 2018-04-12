const queryServer = require('./lib/queryServer');
const get = require('./lib/get');
const create = require('./lib/create');
const and = require('./lib/and');

global.definitions = [];

module.exports = {
  create,
  get,
  and,
  query: queryServer,
};
