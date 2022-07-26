const knex = require("knex");
require("dotenv").config();
const cipher = require("./shared/cipher");
const secrets = require("./shared/secrets");

const conn = knex({
  client: "mysql",

  connection: {
    host: secrets.get("db_host") || process.env.db_host,
    user: secrets.get("db_user") || process.env.db_user,
    password: secrets.get("db_password") || process.env.db_password,
    database: secrets.get("db_database") || process.env.db_database,
    port: Number(secrets.get("db_port")) || Number(process.env.db_port),
  },

  migrations: {
    directory: `${__dirname}/db/migrations`,
  },

  seeds: {
    directory: `${__dirname}/db/seeds`,
  },
});

const getTenantConnByObject = async function (tenant) {
  const decryptedPass = cipher.decrypt(JSON.parse(tenant.db_password));
  return knex({
    client: "mysql",
    connection: {
      host: tenant.db_host,
      user: tenant.db_username,
      password: decryptedPass,
      database: tenant.db_name,
      port: Number(process.env.db_port),
    },
  });
};

const getNewKnexConn = function (dbName) {
  return knex({
    client: "mysql",
    connection: {
      host: process.env.db_host,
      user: process.env.db_root_usr,
      password: process.env.db_root_password,
      port: Number(process.env.db_port),
      database: dbName,
    },
  });
};

// Set on tenant middleware when a request its being processed
let tenantConn;

const setTenantConn = async function (tenantSlug) {
  tenantConn = await getTenantConnByObject(tenantSlug);
};

const getTenantConn = async function () {
  return await tenantConn;
};

module.exports = {
  defaultConn: conn,
  getTenantConnByObject,
  getNewKnexConn,
  getTenantConn,
  setTenantConn,
};
