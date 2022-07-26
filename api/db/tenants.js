const { defaultConn } = require("../knexfile");
const enumResultDA = require("./enums/result_status_data_access");
const enumTablesDA = require("./enums/tables_data_access");

module.exports = {
  getById: async (id) => {
    const resultDA = { code: enumResultDA.SUCCESS, data: undefined };

    try {
      const tenant = await defaultConn
        .select(
          "id",
          "slug",
          "db_name",
          "db_host",
          "db_username",
          "db_password",
          "db_port"
        )
        .table(enumTablesDA.TENANTS)
        .where("id", id)
        .first();

      resultDA.data = tenant;

      if (!tenant) resultDA.code = enumResultDA.ITEM_NOT_FOUND;
    } catch (error) {
      console.error(error);
      return error;
    }
    return resultDA;
  },
  getByDbName: async (name) => {
    const resultDA = { code: enumResultDA.SUCCESS, data: undefined };

    try {
      const tenant = await defaultConn
        .select(
          "id",
          "slug",
          "db_name",
          "db_host",
          "db_username",
          "db_password",
          "db_port"
        )
        .table(enumTablesDA.TENANTS)
        .where("db_name", name)
        .first();

      resultDA.data = tenant;

      if (!tenant) resultDA.code = enumResultDA.ITEM_NOT_FOUND;
    } catch (error) {
      console.error(error);
      return error;
    }
    return resultDA;
  },
};
