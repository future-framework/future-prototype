const _ = require('lodash')
const gql = require('graphql-tag')

const findDefinition = require('./definitions/find');
const getQueryString = require('./query/getQueryString')
const getVariables = require('./query/variables/index')

module.exports = async (name, directVariables) => {
  const definition = findDefinition({ name })
  if (!definition) throw `Definition for ${name} missing.`;

  const variables = await getVariables(definition, directVariables);
  const queryString = await getQueryString(definition, variables)
  const query = gql(queryString)

  const serverQuery = require('./server/query');
  const serverResult = await serverQuery({
    query,
    variables,
  });

  const result = _.omit(_.get(serverResult, `data.${definition.name}`), '__typename');
  console.log(result);
  return result;
};
