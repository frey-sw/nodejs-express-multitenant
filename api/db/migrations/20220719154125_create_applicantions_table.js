// Fetch new knex connection to tenant db
const { getNewKnexConn } = require("../../knexfile");

const companyDBName = require("../helpers/companyDB_name");

// Fetch new knex connection to tenant db
const conn = getNewKnexConn(companyDBName);

exports.up = function (knex) {
  return conn.schema.createTable("applications", function (table) {
    table.increments("id").primary().notNullable();
    table.integer("amount").notNullable();
    table.integer("payments").notNullable();
    table.integer("monthly_payments").notNullable();
    table.datetime("answer_date");
    table.boolean("answer");
    table.string("answer_detail");
    table.integer("user_ci").notNullable();
    table.string("user_email", 256).notNullable();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .index();
    table.datetime("created_date").notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable("applications");
};
