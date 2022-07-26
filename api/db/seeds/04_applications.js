const companyDBName = require("../helpers/companyDB_name");

// Fetch new knex connection to tenant db
const { getNewKnexConn } = require("../../knexfile");
const conn = getNewKnexConn(companyDBName);

exports.seed = async (knex) => {
  const result = await conn.count("id as count").from("applications").first();
  if (result.count < 1) {
    await conn("applications").insert([
      {
        amount: 20000,
        payments: 1700,
        monthly_payments: 12,
        answer_date: knex.fn.now(),
        answer: 1,
        answer_detail: "Prestamo aprobado",
        user_ci: 987654322,
        user_email: "usuario2@textum.com.uy",
        user_id: 2,
        created_date: knex.fn.now(),
      },
      {
        amount: 5000,
        payments: 1680,
        monthly_payments: 3,
        answer_date: null,
        answer: null,
        answer_detail: null,
        user_ci: 987654323,
        user_email: "usuario3@textum.com.uy",
        user_id: 3,
        created_date: knex.fn.now(),
      },
      {
        amount: 1234,
        payments: 210,
        monthly_payments: 6,
        answer_date: knex.fn.now(),
        answer: 0,
        answer_detail: "Prestamo rechazado",
        user_ci: 987654323,
        user_email: "usuario3@textum.com.uy",
        user_id: 3,
        created_date: knex.fn.now(),
      },
      {
        amount: 15000,
        payments: 850,
        monthly_payments: 18,
        answer_date: knex.fn.now(),
        answer: 1,
        answer_detail: "Prestamo aprobado",
        user_ci: 987654324,
        user_email: "usuario4@textum.com.uy",
        user_id: 4,
        created_date: knex.fn.now(),
      },

      {
        amount: 5000,
        payments: 425,
        monthly_payments: 12,
        answer_date: knex.fn.now(),
        answer: null,
        answer_detail: null,
        user_ci: 987654324,
        user_email: "usuario4@textum.com.uy",
        user_id: 4,
        created_date: knex.fn.now(),
      },
    ]);
  }
};
