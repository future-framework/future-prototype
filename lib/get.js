const _ = require('lodash')
const gql = require('graphql-tag')

const queryServer = require('./queryServer');
const findDefinition = require('./definitions/find');
const queryInputTypes = require('./queryInputTypes');

module.exports = async function(name, variables) {
  const definition = findDefinition({ name });
  const outputAttributes = _.keys(definition.output);

  const functionArgs = 'image: $image';

  const query = gql`
    query(${queryInputTypes(name, variables)}) {
      ${name}(${functionArgs}) {
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
