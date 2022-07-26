const { getNewKnexConn } = require("../../knexfile");
// Fetch new knex connection to tenant db
const conn = getNewKnexConn();

const companyName = require("../helpers/companyDB_name");

exports.up = async function (knex) {
  await conn.raw("CREATE DATABASE IF NOT EXISTS " + companyName);
  await conn.raw(
    "GRANT ALL PRIVILEGES ON " +
      companyName +
      ".* TO '" +
      process.env.db_user +
      "'@'%'"
  );
};

exports.down = async function (knex) {
  await conn.raw("DROP DATABASE securitas_db");
};

exports.seed = async () => {};
