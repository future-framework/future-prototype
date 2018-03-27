const _ = require('lodash');

const encode = d => {
  const newArr = [];
  _.padEnd(d, 20, '\0').split('').map(c => {
    newArr.push((c.charCodeAt(0) / 255))
  })
  return newArr
}

const encodeData = data => {

  return data.map( d => {

    return {
        input:  encode(d.input),
        output: d.output
      }
  })
}

const serialize = data => encodeData(data)

module.exports = {
  serialize:  serialize,
  encode:     encode,
}
