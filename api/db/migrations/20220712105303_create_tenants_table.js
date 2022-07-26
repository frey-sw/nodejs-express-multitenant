exports.up = async function (knex) {
  return knex.schema.createTable("tenants", function (table) {
    table.increments("id").primary().notNullable();
    table.string("slug", 255).unique().notNullable();
    table.string("db_name", 255).unique().notNullable();
    table.string("db_host", 255);
    table.string("db_username", 255);
    table.string("db_password", 255);
    table.integer("db_port").defaultTo(3306);
    table.datetime("created_at").defaultTo(knex.fn.now());
    table.datetime("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable("tenants");
};
