const { GraphQLObjectType, GraphQLFloat, GraphQLString } = require('graphql');

exports.Type = new GraphQLObjectType({
  name: 'Statistic',
  fields: () => ({
    id: { type: GraphQLString },
    wagered: { type: GraphQLFloat },
    profit: { type: GraphQLFloat },
    wagered_dice: { type: GraphQLFloat },
    profit_dice: { type: GraphQLFloat },
    wagered_wheel: { type: GraphQLFloat },
    profit_wheel: { type: GraphQLFloat },
  }),
});
