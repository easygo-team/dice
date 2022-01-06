exports.up = async (knex) => {
  await knex.schema.createTable('statistic', (table) => {
    table.uuid('id').primary();

    table.string('user').notNull().unique();

    table.float('wagered').notNull().defaultTo(0);
    table.float('profit').notNull().defaultTo(0);
  });
};

exports.down = async () => {};
