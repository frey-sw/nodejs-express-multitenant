const resultsBL = require("./enums/shared/result_status");
const userTypesEnum = require("./enums/users/user_types");
const applicationsDA = require("../db/applications");
const usersDA = require("../db/users");
const tenantsDA = require("../db/tenants");
const companyDBName = require("../db/helpers/companyDB_name");

const applicationsFilterBy = require("../business/enums/applications/applications-filter-by");
const applicationsOrderBy = require("../business/enums/applications/applications-order-by");
const { getTenantConnByObject } = require("../knexfile");

module.exports = {
  getApplications: async (
    page,
    size,
    orderBy,
    orderDirection,
    filterBy,
    searchText,
    userCi,
    rol
  ) => {
    const result = { code: resultsBL.SUCCESS, data: undefined };
    try {
      if (rol !== userTypesEnum.ADMINISTRADOR) {
        result.code = resultsBL.INVALID_CREDENTIALS;
      } else {
        // Actualmente solo se esta haciendo esta consulta utilizando 1 solo tenant
        // En caso de seguir el proyecto, se debe de optimizar esta consulta, para impactar a todos los tenants disponibles
        // Se debe de facilitar la consulta utilizando filtrado por tenant
        const tenant = await tenantsDA.getByDbName(companyDBName);

        // Sobreescribo el filtro de tenant por el dato anterior
        let orderByOverride =
          orderBy === applicationsOrderBy.TENANT
            ? applicationsOrderBy.CI
            : orderBy;

        const tenantConnection = await getTenantConnByObject(tenant.data);
        const appResult = await applicationsDA.getApplications(
          page,
          size,
          filterBy,
          searchText,
          orderByOverride,
          orderDirection,
          tenantConnection
        );

        if (appResult.data.data) {
          appResult.data.data = appResult.data.data.map((item) => {
            return {
              ...item,
              company: tenant.data.slug,
            };
          });
        }

        if (appResult.code !== resultsBL.ERROR) {
          result.data = appResult.data;
        } else {
          result.code = appResult.code;
        }
      }
    } catch (error) {
      console.error(error);
      result.code = resultsBL.ERROR;
    }
    return result;
  },
  createApplications: async (
    amount,
    payments,
    monthly_payments,
    user_id,
    user_email,
    user_ci
  ) => {
    const result = { code: resultsBL.SUCCESS, data: undefined };
    try {
      const tenant = await tenantsDA.getByDbName(companyDBName);

      const tenantConnection = await getTenantConnByObject(tenant.data);
      const appResult = await applicationsDA.createApplication(
        amount,
        payments,
        monthly_payments,
        user_id,
        user_email,
        user_ci,
        tenantConnection
      );

      if (appResult.code !== resultsBL.ERROR) {
        result.data = appResult.data;
      } else {
        result.code = 200;
      }
    } catch (error) {
      console.error(error);
      result.code = resultsBL.ERROR;
    }
    return result;
  },
};
