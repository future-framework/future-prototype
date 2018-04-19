const _ = require('lodash')
const fs = require('fs');
const path = require('path');
const callsite = require('callsite');

const get = require('./get');
const createDefinition = require('./definitions/create');
const resolveVariables = require('./resolveVariables');

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
// const callerDirname = () => {
//   const stack = callsite();
//   const requester = stack[5].getFileName();
//
//   return path.dirname(requester);
// };
//
// const trainDataFilename = (definition) => {
//   return `${callerDirname()}/${definition.name}-train-data.json`;
// };
//
// const saveTrainData = (definition, data) => {
//   fs.writeFileSync(trainDataFilename(definition), JSON.stringify(data, null, 2), 'utf8');
// };
//
// const loadTrainData = (definition) => {
//   return JSON.parse(fs.readFileSync(trainDataFilename(definition), 'utf8'));
// };

const resolvedVariables = async (innerVariables) => {
  const result = {};

  _.keys(innerVariables).forEach(async (key) => {
    const val = innerVariables[key];
    console.log('key', key)
    console.log('val',val)
    result[key] = await val;
  });

  return result;
};

Object.unfreeze=function(o){
  var oo=undefined;
  if( o instanceof Array){
    oo=[];var clone=function(v){oo.push(v)};
    o.forEach(clone);
  }else if(o instanceof String){
    oo=new String(o).toString();
  }else  if(typeof o =='object'){

    oo={};
    for (var property in o){oo[property] = o[property];}


  }
  return oo;
}

module.exports = function(fn, opts) {
  createDefinition({
    fn: async (innerVariables) => {
      const finalVariables = _.merge(await resolvedVariables(await innerVariables, opts), { output: {} })
      console.log('innerVariables', await innerVariables);
      console.log('finalVariables', await finalVariables);
      return fn(finalVariables)
    },
    ...opts,
    inputType: `${_.upperFirst(_.camelCase(opts.name))}Input`,
    outputType: _.upperFirst(_.camelCase(opts.name)),
  });

  const result = (variables) => {
    const innerResult = get(fn.name, variables);
    Object.defineProperty(innerResult, 'name', { value: fn.name });
    return innerResult;
  };

  return result;
};
