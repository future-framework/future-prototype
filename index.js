const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
  type ComplexInput {
    id: Int
    dsad: String
  }

  type Query {
    hello(name: String): String!
    eyes(aaa: ComplexInput): EyesOutput
    eyeColor(eye: EyeOutput): EyeColorOutput
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    eyes: (imageUrl) => {
      return [
        {
          bbox: [],
          isLeft: true
        },
      ]
    }
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server is running on localhost:4000'))

`{
  eyes(imageUrl: $String) {
    bbox
    isLeft
  }
}`
  => hello: 'Hellow world',
  => eyes: {
    bbox: [dasdsa]
  }

`{
  eyes(imageUrl: 'dasdsa') {
    bbox
    isLeft
    isRight
    color
  }
}`

`{
  head(videoUrl: ...)
    bbox
  }
}`
