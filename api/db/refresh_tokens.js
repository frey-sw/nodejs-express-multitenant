const { defaultConn } = require("../knexfile");
const enumResultDA = require("./enums/result_status_data_access");
const enumTablesDA = require("./enums/tables_data_access");

module.exports = {
  add: async (data) => {
    const resultDA = { code: enumResultDA.SUCCESS, data };
    try {
      await defaultConn(enumTablesDA.REFRESH_TOKENS).insert(
        defaultConn.raw(
          `(hash_refresh_token, ci, date_expired) values ( ? , ? , ? ) 
            ON DUPLICATE KEY UPDATE hash_refresh_token=?, date_expired=?`,
          [
            data.hash_refresh_token,
            data.ci,
            data.date_expired,
            data.hash_refresh_token,
            data.date_expired,
          ]
        )
      );

      return resultDA;
    } catch (error) {
      console.error(error);
      return { code: enumResultDA.ERROR, data: error };
    }
  },
  deleteByCI: async (ci) => {
    const resultDA = { code: enumResultDA.SUCCESS, data: undefined };
    try {
      resultDA.data = await defaultConn(enumTablesDA.REFRESH_TOKENS)
        .where("ci", ci)
        .del();
    } catch (error) {
      console.error(error);
      return { code: enumResultDA.ERROR, data: error };
    }
    return resultDA;
  },

  getByCI: async (ci) => {
    const resultDA = { code: enumResultDA.SUCCESS, data: undefined };
    try {
      const result = await defaultConn
        .select("ci", "hash_refresh_token", "date_expired")
        .table(enumTablesDA.REFRESH_TOKENS)
        .where("ci", ci)
        .first();

      if (result) resultDA.data = result;
      else resultDA.code = enumResultDA.ITEM_NOT_FOUND;
    } catch (error) {
      console.error(error);
      return { code: enumResultDA.ERROR, data: error };
    }
    return resultDA;
  },
};
