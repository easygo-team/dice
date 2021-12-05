exports.up = async knex => {
  await knex.schema.createTable('statistic', table => {
    table.uuid('id').primary();

    table.string('user').notNull();
    table.string('game').notNull().unique();
    table.unique(['user', 'game']);
    table.float('wagered').notNull();
    table.float('profit').notNull();
  });
};

exports.down = async () => {};
