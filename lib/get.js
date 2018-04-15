const _ = require('lodash')
const gql = require('graphql-tag')

const queryServer = require('./queryServer');
const findDefinition = require('./definitions/find');
const queryInputTypes = require('./queryInputTypes');
const functionArgs = require('./functionArgs');

module.exports = async function(name, variables) {
  const definition = findDefinition({ name });
  const outputAttributes = _.keys(definition.output);

  const query = gql`
    query(${queryInputTypes(name, variables)}) {
      ${name}(${functionArgs(name, variables)}) {
        ${outputAttributes.join("\n")}
      }
    }
  `;

  const result = await queryServer({
    query,
    variables,
  });

  return _.get(result, `data.${name}`);
};
