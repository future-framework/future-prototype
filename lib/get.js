const _ = require('lodash')
const gql = require('graphql-tag')

const findDefinition = require('./definitions/find');
const queryInputTypes = require('./query/inputTypes');
const functionArgs = require('./query/functionArgs');
const cacheContent = require('./cache/content');

module.exports = async (name, directVariables) => {
  const definition = findDefinition({ name });

  const outputAttributes = _.keys(definition.output);

  const inputVariables = await getInputVariables(definition, directVariables);

  const variables = _.merge(inputVariables, directVariables);
  const qInputTypes = await queryInputTypes(definition, variables)
  const qFunctionArgs = await functionArgs(name, variables)

  const queryString = `
    query(${qInputTypes}) {
      ${name}(${qFunctionArgs}) {
        ${outputAttributes.join("\n")}
      }
    }
  `;
  const query = gql(queryString)

  const serverResult = await serverQuery({
    query,
    variables,
  });

  const result = _.omit(_.get(serverResult, `data.${name}`), '__typename');
  return result;
};

// keep here because of the circular dependency
const getInputVariables = require('./getInputVariables')
const serverQuery = require('./server/query');
