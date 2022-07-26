const enumResultsDA = require("./enums/result_status_data_access");
const enumTablesDA = require("./enums/tables_data_access");

module.exports = {
  getUserBy: async (ci, conn) => {
    const result = { code: enumResultsDA.SUCCESS, data: undefined };
    try {
      const user = await conn
        .select("ci", "celular", "first_name", "last_name", "created_date")
        .table(enumTablesDA.USERS)
        .where("ci", ci)
        .first();

      result.data = user;

      if (!user) result.code = enumResultsDA.ITEM_NOT_FOUND;
    } catch (error) {
      console.error(error);
      result.code = enumResultsDA.ERROR;
    }
    return result;
  },
};
