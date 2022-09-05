/* eslint-disable camelcase */
const { GraphQLObjectType, GraphQLFloat, GraphQLString } = require('graphql');

exports.Type = new GraphQLObjectType({
  name: 'Statistic',
  fields: () => ({
    id: { type: GraphQLString },
    wagered: { type: GraphQLFloat },
    profit: { type: GraphQLFloat },
    diceWagered: {
      type: GraphQLFloat,
      resolve: ({ dice_wagered }) => {
        return dice_wagered;
      },
    },
    diceProfit: {
      type: GraphQLFloat,
      resolve: ({ dice_profit }) => {
        return dice_profit;
      },
    },
    wheelWagered: {
      type: GraphQLFloat,
      resolve: ({ wheel_wagered }) => {
        return wheel_wagered;
      },
    },
    wheelProfit: {
      type: GraphQLFloat,
      resolve: ({ wheel_profit }) => {
        return wheel_profit;
      },
    },
  }),
});
