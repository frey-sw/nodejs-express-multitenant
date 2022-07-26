const companyDBName = require("../helpers/companyDB_name");

// Fetch new knex connection to tenant db
const { getNewKnexConn } = require("../../knexfile");
const conn = getNewKnexConn(companyDBName);

exports.seed = async (knex) => {
  const result = await conn.count("id as count").from("users").first();
  if (result.count < 1) {
    await conn("users").insert([
      {
        id: 1,
        ci: 123456789,
        celular: 099999999,
        first_name: "Administrador",
        last_name: "Test",
      },
      {
        id: 2,
        ci: 987654321,
        celular: 099876541,
        first_name: "Usuario 1",
        last_name: "Test",
        created_date: knex.fn.now(),
      },
      {
        id: 3,
        ci: 987654322,
        celular: 099876542,
        first_name: "Usuario 2",
        last_name: "Test",
        created_date: knex.fn.now(),
      },
      {
        id: 4,
        ci: 987654323,
        celular: 099876543,
        first_name: "Usuario 3",
        last_name: "Test",
        created_date: knex.fn.now(),
      },
      {
        id: 5,
        ci: 987654324,
        celular: 0998786544,
        first_name: "Usuario 4",
        last_name: "Test",
        created_date: knex.fn.now(),
      },
    ]);
  }
};
