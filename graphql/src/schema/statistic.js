const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');

exports.Type = new GraphQLObjectType({
  name: 'Statistic',
  fields: () => ({
    id: { type: GraphQLString },
    wagered: { type: GraphQLFloat },
    profit: { type: GraphQLFloat }
  })
});
