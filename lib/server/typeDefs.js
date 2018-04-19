const queryTypeDefs = require('../query/typeDefs')
const types = require('./types')

module.exports = () => `
  type Query {
    ${queryTypeDefs()}
  }

  input Image {
    pixels: [Int!]!
  }

  input Pixel {
    r: Float!
    g: Float!
    b: Float!
  }

  ${types()}

  scalar JSON
`
