const tenantsDA = require("../db/tenants");
const enumResultDA = require("../db/enums/result_status_data_access");
const usersDA = require("../db/accounts");
const resultsBL = require("./enums/shared/result_status");

module.exports = {
  getInfoAndValidateCI: async (userCI, tenantId) => {
    const result = { code: resultsBL.SUCCESS, data: undefined };
    let userResult = {};
    try {
      userResult = await usersDA.getByCI(userCI);
      switch (userResult.code) {
        case enumResultDA.SUCCESS:
          if (userResult.data) {
            const user = userResult.data;
            // Validates user with tenant id return tenant info
            if (parseInt(user.tenant_id) === parseInt(tenantId)) {
              const tenantResult = await tenantsDA.getById(tenantId);
              result.data = tenantResult.data;
              break;
            }
          }
          result.code = resultsBL.FORBIDDEN;
          break;
        case enumResultDA.ITEM_NOT_FOUND:
          result.code = resultsBL.FORBIDDEN;
          break;
        default:
          result.code = userResult.code;
          break;
      }
    } catch (error) {
      console.error(error);
      result.code = resultsBL.ERROR;
      result.data = error;
    }
    return result;
  },
};
