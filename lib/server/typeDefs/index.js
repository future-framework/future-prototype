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

    type Bbox {
      left: Float
      right: Float
      top: Float
      bottom: Float
    }

    scalar JSON

    ${functionInputsOutputs()}
  `;
}
