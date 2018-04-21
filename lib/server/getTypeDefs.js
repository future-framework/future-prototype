const queryTypeDefs = require('../query/typeDefs')
const types = require('./types')

module.exports = async () => {
  console.log(await queryTypeDefs())
  return `
    type Query {
      ${await queryTypeDefs()}
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
  `;
}
