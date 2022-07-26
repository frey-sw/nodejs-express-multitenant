const { defaultConn } = require("../knexfile");
const enumResultDA = require("./enums/result_status_data_access");
const enumTablesDA = require("./enums/tables_data_access");

module.exports = {
  getByCI: async (ci) => {
    const resultDA = { code: enumResultDA.SUCCESS, data: undefined };

    try {
      const account = await defaultConn
        .select("id", "email", "ci", "password", "active", "type", "tenant_id")
        .table(enumTablesDA.ACCOUNTS)
        .where("ci", ci)
        .first();

      resultDA.data = account;

      if (!account) resultDA.code = enumResultDA.ITEM_NOT_FOUND;
    } catch (error) {
      console.error(error);
      return error;
    }
    return resultDA;
  },
};
