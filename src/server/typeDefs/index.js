const query = require('./query')
const functionInputsOutputs = require('./functionInputsOutputs')

module.exports = async () => {
  return `
    type Query {
      ${await query()}
    }

    input Image {
      pixels: [Int!]!
    }

    input Pixel {
      r: Float!
      g: Float!
      b: Float!
    }

    scalar JSON

    ${functionInputsOutputs()}
  `;
}
