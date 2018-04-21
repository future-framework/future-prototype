const _ = require('lodash')
const gql = require('graphql-tag')

const findDefinition = require('./definitions/find');
const queryInputTypes = require('./query/inputTypes');
const functionArgs = require('./query/functionArgs');
const cacheContent = require('./cache/content');
const getQueryString = require('./query/getQueryString')
const getVariables = require('./query/variables/index')

module.exports = async (name, directVariables) => {
  const variables = await getVariables(name, directVariables);
  const queryString = await getQueryString(name, variables)
  const query = gql(queryString)

  const serverResult = await serverQuery({
    query,
    variables,
  });

  const result = _.omit(_.get(serverResult, `data.${name}`), '__typename');
  console.log(result);
  return result;
};

// keep here because of the circular dependency
const serverQuery = require('./server/query');
