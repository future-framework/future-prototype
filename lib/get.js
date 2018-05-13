const _ = require('lodash')
const gql = require('graphql-tag')

const findDefinition = require('./definitions/find');
const generateQuery = require('./query/generate')

module.exports = async (name, variables) => {
  const definition = findDefinition({ name })
  if (!definition) {
    console.log(definitions)
    throw `Definition for ${name} missing.`;
  }

  const query = gql(await generateQuery(definition, variables))

  const serverQuery = require('./server/query');
  const serverResult = await serverQuery({
    query,
    variables,
  });

  return _.omit(_.get(serverResult, `data.${definition.name}`), '__typename');
};
