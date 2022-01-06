exports.up = async (knex) => {
  await knex.schema.table('statistic', (table) => {
    table.float('wagered_dice').notNull().defaultTo(0);
    table.float('profit_dice').notNull().defaultTo(0);

    table.float('wagered_wheel').notNull().defaultTo(0);
    table.float('profit_wheel').notNull().defaultTo(0);
  });

  await knex('statistic').update('wagered_dice', knex.ref('wagered'));
  await knex('statistic').update('profit_dice', knex.ref('profit'));
};

exports.down = async () => {};
