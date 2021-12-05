const { v4: uuid } = require('uuid');
const { knex } = require('./knex');

exports.updateStatistic = async ({ user, amount, payout }, game) => {
  await knex.raw(
    `
      insert into statistic (
        "id", "user", "wagered", "profit", "game"
      ) values (
        :id, :user, :wagered, :profit, :game
      )
      on conflict ("user", "game") do  update
      set 
      wagered = statistic.wagered + :wagered,
      profit = statistic.profit + :profit
    `,
    {
      id: uuid(),
      user,
      game,
      wagered: amount,
      profit: payout - amount,
    }
  );
};

exports.getStatistic = async ({ user }) => {
  const [diceStatistic] = await knex('statistic')
    .where('user', user)
    .where('game', 'dice');
  const [wheelStatistic] = await knex('statistic')
    .where('user', user)
    .where('game', 'wheel');
  return [diceStatistic, wheelStatistic];
};
