const queryServer = require('./lib/queryServer');
const get = require('./lib/get');
const create = require('./lib/create');
const createMl = require('./lib/createMl');
const and = require('./lib/and');

global.definitions = [];

module.exports = (opts) => {
  return {
    create,
    createMl,
    get,
    and,
    query: queryServer,
  };
};
