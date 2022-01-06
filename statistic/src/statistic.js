const { v4: uuid } = require('uuid');
const { knex } = require('./knex');

exports.updateStatistic = async ({ user, amount, payout }, game) => {
  await knex.raw(
    `
      insert into statistic (
        "id", "user", "wagered", "profit", "wagered_${game}", "profit_${game}"
      ) values (
        :id, :user, :wagered, :profit, :wagered, :profit
      )
      on conflict ("user") do  update
      set 
      wagered = statistic.wagered + :wagered,
      profit = statistic.profit + :profit,
      wagered_${game} = statistic.wagered_${game} + :wagered,
      profit_${game} = statistic.profit_${game} + :profit
    `,
    {
      id: uuid(),
      user,
      wagered: amount,
      profit: payout - amount,
    }
  );
};

exports.getStatistic = async ({ user }) => {
  const [statistic] = await knex('statistic').where('user', user);
  return statistic;
};
