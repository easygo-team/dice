const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
} = require('graphql');
const axios = require('axios');
const User = require('./user');
const Seed = require('./seed');

const seedCache = {};

exports.Type = new GraphQLObjectType({
  name: 'WheelBet',
  fields: () => ({
    id: { type: GraphQLString },
    amount: { type: GraphQLFloat },
    payout: { type: GraphQLFloat },
    multiplier: { type: GraphQLFloat },
    result: { type: GraphQLInt },
    nonce: { type: GraphQLInt },
    user: {
      type: User.Type,
      resolve: ({ user }) => ({ name: user }),
    },
    seed: {
      type: Seed.Type,
      resolve: async ({ seed_id: seedId }) => {
        if (seedCache[seedId]) {
          return seedCache[seedId];
        }

        const { data } = await axios.post(`http://wheel/get-seed`, { seedId });
        seedCache[seedId] = data;
        return data;
      },
    },
  }),
});