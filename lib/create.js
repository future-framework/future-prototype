const _ = require('lodash')
const fs = require('fs');
const path = require('path');
const callsite = require('callsite');

const get = require('./get');
const createDefinition = require('./definitions/create');
const resolveVariables = require('./resolveVariables');

const train = (definition) => {
  if (!definition.train) return;
  if (!process.env.FUTURE_TRAIN) return loadTrainData(definition);

  const {
    train: {
      fn,
      variables,
    },
    train,
  } = definition;

  const result = fn(resolveVariables(train, variables, 'isCollection'));
  saveTrainData(definition, result);
  return result;
};

const callerDirname = () => {
  const stack = callsite();
  const requester = stack[5].getFileName();

  return path.dirname(requester);
};

const trainDataFilename = (definition) => {
  return `${callerDirname()}/${definition.name}-train-data.json`;
};

const saveTrainData = (definition, data) => {
  fs.writeFileSync(trainDataFilename(definition), JSON.stringify(data, null, 2), 'utf8');
};

const loadTrainData = (definition) => {
  return JSON.parse(fs.readFileSync(trainDataFilename(definition), 'utf8'));
};

module.exports = function(fn, opts) {
  const trainData = train(opts);

  createDefinition({
    fn: (innerVariables) => fn(_.merge(innerVariables, { train: trainData })),
    ...opts,
    inputType: `${_.upperFirst(_.camelCase(opts.name))}Input`,
    outputType: _.upperFirst(_.camelCase(opts.name)),
  });

  const result = async (variables) => {
    return await get(fn.name, variables);
  };

  Object.defineProperty(result, 'name', { value: fn.name });
  return result;
};
