exports.up = function (knex) {
  return knex.schema.createTable("refresh_tokens", function (table) {
    table.integer("ci").notNullable().index().primary();
    table.string("hash_refresh_token", 256).notNullable();
    table.datetime("date_expired").notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("refresh_tokens");
};
