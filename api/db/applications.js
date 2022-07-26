const { getTenantConn } = require("../knexfile");
const enumTablesDA = require("./enums/tables_data_access");
const enumResultDA = require("./enums/result_status_data_access");
const enumOrderBy = require("../business/enums/applications/applications-order-by");
const orderDirectionEnum = require("../business/enums/shared/order-direction");
const applicationsFilterBy = require("../business/enums/applications/applications-filter-by");

module.exports = {
  getApplications: async (
    page,
    size,
    filter,
    searchText,
    orderBy,
    orderDirection,
    conn
  ) => {
    const result = { code: enumResultDA.SUCCESS, data: undefined };

    try {
      if (!orderBy) {
        orderBy = enumOrderBy.CI;
      }
      if (!orderDirection) {
        orderDirection = orderDirectionEnum.ASC;
      }
      page = parseInt(page);
      if (page < 1) {
        page = 1;
      }
      size = parseInt(size);

      const offset = (page - 1) * size;

      const countResult = await conn
        .count("* as count")
        .table(enumTablesDA.APPLICATIONS)
        .first();
      let applicationsResult;

      let shouldFilter = filter !== applicationsFilterBy.ALL || !!searchText;

      if (!shouldFilter) {
        applicationsResult = await conn
          .select(
            "applications.id",
            "applications.amount",
            "applications.payments",
            "applications.monthly_payments",
            "applications.answer_date",
            "applications.answer",
            "applications.answer_detail",
            "applications.user_ci",
            "applications.user_email",
            "users.celular",
            "applications.user_id",
            "applications.created_date"
          )
          .from(enumTablesDA.APPLICATIONS)
          .leftJoin(enumTablesDA.USERS, "users.id", "applications.user_id")
          .offset(offset)
          .limit(size)
          .orderBy(orderBy, orderDirection);
      } else {
        let query = ``;
        if (searchText) {
          query += `user_ci LIKE '%${searchText}%'`;
        }
        if (filter) {
          switch (filter) {
            case applicationsFilterBy.PENDING:
              query += `answer is null`;
              break;
            case applicationsFilterBy.APPROVED:
              query += `answer = 1`;
              break;
            case applicationsFilterBy.REJECTED:
              query += `answer = 0`;
              break;
            default:
              break;
          }
        }
        applicationsResult = await conn
          .select(
            "applications.id",
            "applications.amount",
            "applications.payments",
            "applications.monthly_payments",
            "applications.answer_date",
            "applications.answer",
            "applications.answer_detail",
            "applications.user_ci",
            "applications.user_email",
            "users.celular",
            "applications.user_id",
            "applications.created_date"
          )
          .from(enumTablesDA.APPLICATIONS)
          .leftJoin(enumTablesDA.USERS, "users.id", "applications.user_id")
          .whereRaw(query)
          .offset(offset)
          .limit(size)
          .orderBy(orderBy, orderDirection);
      }

      result.data = {
        total: countResult.count,
        to: offset + applicationsResult.length,
        from: offset,
        size,
        offset,
        lastPage: Math.ceil(countResult.count / size),
        currentPage: page,
        data: applicationsResult,
      };

      if (!applicationsResult) {
        result.data = undefined;
        result.code = enumResultDA.ITEM_NOT_FOUND;
      }
    } catch (error) {
      console.error(error);
      result.code = enumResultDA.ERROR;
    }
    return result;
  },
  createApplication: async (
    amount,
    monthly_payments,
    user_id,
    user_email,
    user_ci,
    conn
  ) => {
    const result = { code: enumResultDA.SUCCESS };

    try {
      await conn(enumTablesDA.APPLICATIONS).insert({
        amount,
        monthly_payments,
        user_id,
        user_email,
        user_ci,
        created_date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error(error);
      result.code = enumResultDA.ERROR;
    }
    return result;
  },
};
