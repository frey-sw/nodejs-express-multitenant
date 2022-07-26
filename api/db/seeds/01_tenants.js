const cipher = require("../../shared/cipher");

exports.seed = async function (knex) {
  const result = await knex.count("id as count").from("tenants").first();
  if (result.count < 1) {
    await knex("tenants").insert([
      {
        slug: "Securitas",
        db_name: "securitas_db",
        db_host: process.env.db_host,
        db_username: process.env.db_user,
        db_password: cipher.encrypt(process.env.db_password),
        db_port: process.env.db_port,
      },
    ]);
  }
};
