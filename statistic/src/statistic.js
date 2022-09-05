const { v4: uuid } = require('uuid');
const { knex } = require('./knex');

exports.updateStatistic = async (channel, user, amount, payout) => {
  await knex.raw(
    `
      insert into statistic (
        "id", "user", "wagered", "profit", "${channel}_wagered", "${channel}_profit"
      ) values (
        :id, :user, :wagered, :profit, :wagered, :profit
      )
      on conflict ( "user" ) do  update
      set 
      wagered = statistic.wagered + :wagered,
      profit = statistic.profit + :profit,
      ${channel}_wagered = statistic.${channel}_wagered  + :wagered,
      ${channel}_profit = statistic.${channel}_profit + :profit
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
