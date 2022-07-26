// Fetch new knex connection to tenant db
const { getNewKnexConn } = require("../../knexfile");

const companyDBName = require("../helpers/companyDB_name");

// Fetch new knex connection to tenant db
const conn = getNewKnexConn(companyDBName);

exports.up = async function (knex) {
  return conn.schema.createTable("users", function (table) {
    table.increments("id").primary().notNullable();
    table.integer("ci").unique().notNullable().index();
    table.integer("celular").notNullable();
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    table.datetime("created_date").notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await conn.schema.dropTable("users");
};
