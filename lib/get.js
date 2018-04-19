const _ = require('lodash')
const gql = require('graphql-tag')

const serverQuery = require('./server/query');
const findDefinition = require('./definitions/find');
const queryInputTypes = require('./query/inputTypes');
const functionArgs = require('./query/functionArgs');

// const train = (definition) => {
//   if (!definition.train) return;
//   if (!process.env.FUTURE_TRAIN) return loadTrainData(definition);
//
//   const {
//     train: {
//       fn,
//       variables,
//     },
//     train,
//   } = definition;
//
//   const result = fn(resolveVariables(train, variables, 'isCollection'));
//   saveTrainData(definition, result);
//   return result;
// };
//
//
// const saveTrainData = (definition, data) => {
//   fs.writeFileSync(trainDataFilename(definition), JSON.stringify(data, null, 2), 'utf8');
// };
//

module.exports = async function(name, directVariables) {
  const definition = findDefinition({ name });
  console.log('GET definition', definition)
  const outputAttributes = _.keys(definition.output);

  const inputVariables = {};

  _.keys(definition.input).forEach(async (key) => {
    const val = definition.input[key];
    if (!val.then) return;
    // inputVariables[key] = 'dude'
    inputVariables[key] = await val;
  });

  const variables = _.merge(inputVariables, directVariables);
  console.log('GET variables', variables);
  console.log('GET NAME', name);

  const query = gql`
    query(${queryInputTypes(name, variables)}) {
      ${name}(${functionArgs(name, variables)}) {
        ${outputAttributes.join("\n")}
      }
    }
  `;

  const serverResult = await serverQuery({
    query,
    variables,
  });

  const result = _.get(serverResult, `data.${name}`);
  return result;
};
