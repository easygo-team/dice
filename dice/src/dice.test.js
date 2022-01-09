/* eslint-disable no-unused-expressions */
const _ = require('lodash');
const { expect } = require('chai');
const { v4: uuid } = require('uuid');
const { rollDice, getActiveSeed, rotateSeed } = require('./dice');
const { knex } = require('./knex');

describe('dice', () => {
  before(async () => {
    await knex.migrate.latest();
  });

  it('rolls the dice', async () => {
    const bet = await rollDice({ user: 'test', amount: 0.1, target: 50 });
    expect(bet).to.be.ok;
  });

  it('used nonce in order', async () => {
    const user = uuid();
    let bets = await Promise.all(
      _.range(5).map(() => rollDice({ user, amount: 0.1, target: 50 }))
    );

    // lets sort them in case bets get returned out of order
    bets = bets.sort((a, b) => a.nonce - b.nonce);

    let [{ nonce: nextNonce }] = bets;

    for (const bet of bets) {
      expect(bet.nonce).to.equal(nextNonce);
      nextNonce += 1;
    }
  });

  it('rotates seed', async () => {
    const user = 'test';
    const bet1 = await rollDice({ user, amount: 0.1, target: 50 });
    expect(bet1).to.be.ok;
    expect(bet1.seed_id).to.not.be.empty;

    const { hash: hash1 } = await getActiveSeed({ user });
    expect(hash1).to.not.be.empty;

    const { hash, secret } = await rotateSeed({ user: 'test' });
    expect(secret).to.not.be.empty;
    expect(hash).to.equal(hash1);

    const bet2 = await rollDice({ user, amount: 0.1, target: 50 });
    expect(bet2).to.be.ok;
    expect(bet2.seed_id).to.not.be.empty;
    expect(bet2.seed_id).not.to.equal(bet1.seed_id);

    const { hash: hash2 } = await getActiveSeed({ user });
    expect(hash2).to.not.be.empty;
    expect(hash2).to.not.equal(hash1);
  });
});
