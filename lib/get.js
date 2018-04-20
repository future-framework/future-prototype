const _ = require('lodash')
const gql = require('graphql-tag')

const serverQuery = require('./server/query');
const findDefinition = require('./definitions/find');
const queryInputTypes = require('./query/inputTypes');
const functionArgs = require('./query/functionArgs');
const cacheContent = require('./cache/content');
const saveCache = require('./cache/save');

module.exports = async function(name, directVariables) {
  const definition = findDefinition({ name });
  const cache = definition.cache && cacheContent(definition);
  if (cache) return cache;

  const outputAttributes = _.keys(definition.output);

  const inputVariables = {};

  _.keys(definition.input).forEach(async (key) => {
    const val = definition.input[key];
    if (!val.then) return;

    inputVariables[key] = await val;
  });

  const cacheVariables = {
    cache,
  };

  console.log(definition.input)
  console.log('inputVariables', inputVariables);

  const variables = _.merge(inputVariables, directVariables, cacheVariables);

  const queryString = `
    query(${queryInputTypes(name, variables)}) {
      ${name}(${functionArgs(name, variables)}) {
        ${outputAttributes.join("\n")}
      }
    }
  `;
  console.log(queryString)
  const query = gql(queryString)

  const serverResult = await serverQuery({
    query,
    variables,
  });

  const result = _.get(serverResult, `data.${name}`);
  saveCache(definition, result);

  return result;
};
