const _ = require('lodash')
const gql = require('graphql-tag')

const findDefinition = require('./definitions/find');
const generateQuery = require('./query/generate')
const getVariables = require('./query/variables/index')

module.exports = async (name, directVariables) => {
  const definition = findDefinition({ name })
  if (!definition) throw `Definition for ${name} missing.`;

  const variables = await getVariables(definition, directVariables);
  const query = gql(await generateQuery(definition, variables))

  const serverQuery = require('./server/query');
  const serverResult = await serverQuery({
    query,
    variables,
  });

  return _.omit(_.get(serverResult, `data.${definition.name}`), '__typename');
};
