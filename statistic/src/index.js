const express = require('express');
const bodyParser = require('body-parser');
const { knex } = require('./knex');
const { redis } = require('./redis');
const { updateStatistic, getStatistic } = require('./statistic');

const possibleChannels = ['dice', 'wheel'];

const response = (handler) => async (req, res) => {
  try {
    res.send(await handler(req.body));
  } catch (e) {
    res.status(400).send(e.message);
  }
};

async function start() {
  await knex.migrate.latest();

  for (const c of possibleChannels) {
    redis.subscribe(c);
  }

  redis.on('message', async (channel, json) => {
    try {
      const { user, amount, payout } = JSON.parse(json);
      await updateStatistic(channel, user, amount, payout);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });
  const app = express();

  app.use(bodyParser.json());

  app.post(
    '/get-statistic',
    response(async ({ user }) => getStatistic({ user }))
  );

  app.listen(80);
}

start();
