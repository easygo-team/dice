const _ = require('lodash');
const crypto = require('crypto');
const { v4: uuid } = require('uuid');
const assert = require('assert');
const { knex } = require('./knex');
const { redis } = require('./redis');

const parseSeed = (seed) => {
  if (!seed) {
    return null;
  }

  if (seed.active) {
    return _.omit(seed, ['secret']);
  }

  return seed;
};

// Multipliers for a 10-segment low risk wheel
const wheelMultipliers = [1.5, 1.2, 1.2, 1.2, 0.0, 1.2, 1.2, 1.2, 1.2, 0.0];

// export multipliers for unit tests
exports.wheelMultipliers = wheelMultipliers;

exports.spinWheel = ({ user, amount }) =>
  knex.transaction(async (trx) => {
    assert(amount >= 0);

    let [seed] = await trx('seed')
      .where('user', user)
      .andWhere('active', true)
      .forUpdate();

    if (!seed) {
      const secret = crypto.randomBytes(32).toString('hex');
      const hash = crypto.createHash('sha256').update(secret).digest('hex');

      await trx.raw(
        `insert into "seed" 
              ("id", "user", "secret", "hash", "nonce", "active") values 
              (:id, :user, :secret, :hash, :nonce, :active) 
              on conflict do nothing`,
        { id: uuid(), user, secret, hash, nonce: 0, active: true }
      );

      [seed] = await trx('seed')
        .where('user', user)
        .andWhere('active', true)
        .forUpdate();
    }

    const nonce = String(seed.nonce + 1);

    const hmac = crypto
      .createHmac('sha256', seed.secret)
      .update(nonce)
      .digest('hex');

    // we take the first 32 bits (4 bytes, 8 hex chars)
    const int = parseInt(hmac.substr(0, 8), 16);
    const float = int / 2 ** 32;

    // get number from 0 - 9
    const result = Math.floor(float * 10);
    assert(result > -1);
    assert(result < 10);

    // get multiplier based on array index
    const multiplier = wheelMultipliers[result];
    const isWin = multiplier > 0;

    // 0.99 applies our house edge of 1%
    const payout = isWin ? amount * multiplier * 0.99 : 0;
    const [bet] = await trx('bet')
      .insert({
        id: uuid(),
        seed_id: seed.id,
        user,
        amount,
        payout,
        result,
        multiplier,
        nonce,
      })
      .returning('*');

    await trx('seed')
      .update('nonce', trx.raw('nonce + 1'))
      .where('id', seed.id);

    await redis.publish('wheel', JSON.stringify(bet));

    return bet;
  });

exports.getBets = async ({ user, limit, offset }) => {
  const bets = await knex('bet')
    .where('user', user)
    .orderBy('bet.created_at', 'desc')
    .limit(limit)
    .offset(offset);

  return bets;
};

exports.getSeed = async ({ seedId }) => {
  const [seed] = await knex('seed').where('id', seedId);
  return parseSeed(seed);
};

exports.rotateSeed = async ({ user }) => {
  const [seed] = await knex('seed')
    .update({ active: false })
    .where({ user, active: true })
    .returning('*');

  return parseSeed(seed);
};

exports.getActiveSeed = async ({ user }) => {
  const [seed] = await knex('seed').where({ user, active: true });
  return parseSeed(seed);
};
