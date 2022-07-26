exports.up = async function (knex) {
  return knex.schema.createTable("accounts", function (table) {
    table.increments("id").primary().notNullable();
    table.integer("ci").unique().notNullable().index();
    table.string("password", 100).notNullable();
    table.string("email", 255).unique().notNullable();
    table.boolean("active").notNull();
    table
      .enu("type", ["ADMINISTRADOR", "USUARIO"], { enumName: "ROL" })
      .notNullable();
    table
      .integer("tenant_id")
      .unsigned()
      .references("id")
      .inTable("tenants")
      .index();
    table.datetime("created_date").notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable("accounts");
};
