const helper = require("./helpers");
const bcrypt = require("bcryptjs");
const randtoken = require("rand-token");
const cipher = require("../shared/cipher");

const resultsBL = require("./enums/shared/result_status");
const userTypesEnum = require("./enums/users/user_types");
const enumResultDA = require("../db/enums/result_status_data_access");
const refreshTokenDA = require("../db/refresh_tokens");
const accountsDA = require("../db/accounts");
const tenantsDA = require("../db/tenants");
const usersDA = require("../db/users");
const { getTenantConn } = require("../knexfile");

module.exports = {
  getUserAccount: async (ci) => {
    const result = { code: resultsBL.SUCCESS, data: undefined };
    try {
      const userAccountResult = await accountsDA.getByCI(ci);
      delete userAccountResult.data.password;

      switch (userAccountResult.code) {
        case enumResultDA.SUCCESS:
          let userAccountData = userAccountResult.data;

          if (userAccountData.type === userTypesEnum.USUARIO) {
            const userInfo = await usersDA.getUserBy(ci, await getTenantConn());
            userAccountData = {
              ...userAccountData,
              ...userInfo.data,
            };
          }

          result.data = userAccountData;
          break;
        case enumResultDA.ITEM_NOT_FOUND:
          result.code = resultsBL.INVALID_CREDENTIALS;
          break;
        default:
          result.code = userAccountResult.code;
          break;
      }
    } catch (error) {
      console.error(error);
      result.code = resultsBL.ERROR;
      result.data = error;
    }
    return result;
  },
  login: async (loginData, rol) => {
    const result = { code: resultsBL.SUCCESS, data: undefined };
    let accountResult = {};
    try {
      accountResult = await accountsDA.getByCI(loginData.ci);
      switch (accountResult.code) {
        case enumResultDA.SUCCESS:
          if (accountResult.data.type !== rol) {
            result.code = resultsBL.INVALID_CREDENTIALS;
            break;
          }

          result.data = accountResult.data;
          const isValidPassword = await bcrypt.compare(
            loginData.password,
            accountResult.data.password
          );

          if (isValidPassword) {
            const tenantResultDA = await tenantsDA.getById(
              accountResult.data.tenant_id
            );

            const payload = {
              user_ci: accountResult.data.ci,
              email: accountResult.data.email,
              rol: accountResult.data.type,
            };

            // Avoid adding tenant information for ADMINS
            if (accountResult.data.type === userTypesEnum.USUARIO) {
              payload.company = cipher.encrypt(
                JSON.stringify({
                  tenant_slug: tenantResultDA.data?.slug,
                  tenant_id: tenantResultDA.data.id,
                })
              );
            }

            result.accessToken = helper.generateAccessToken(payload);

            const refreshToken = randtoken.uid(256);

            const hashedRefreshToken = await bcrypt.hash(
              refreshToken,
              parseInt(process.env.refresh_jwt_secret)
            );

            result.refreshToken = refreshToken;

            const refreshTokenData = {
              ci: loginData.ci,
              hash_refresh_token: hashedRefreshToken,
              date_expired: helper.generateResetTokenExpirationDate(),
            };

            await refreshTokenDA.add(refreshTokenData);
          } else result.code = resultsBL.INVALID_CREDENTIALS;
          break;
        case enumResultDA.ITEM_NOT_FOUND:
          result.code = resultsBL.INVALID_CREDENTIALS;
          break;
        default:
          result.code = accountResult.code;
          break;
      }
    } catch (error) {
      console.error(error);
      result.code = resultsBL.ERROR;
      result.data = error;
    }
    return result;
  },
  logout: async (email) => {
    const result = { code: resultsBL.SUCCESS };
    try {
      return await refreshTokenDA.deleteByCI(email);
    } catch (err) {
      console.error(err);
      result.code = resultsBL.ERROR;
      return result;
    }
  },
  refreshToken: async (requestData) => {
    try {
      const result = { code: resultsBL.SUCCESS };

      const refreshTokenResult = await refreshTokenDA.getByCI(
        requestData.userCi
      );

      if (refreshTokenResult.code === enumResultDA.SUCCESS) {
        const checkHashResult = await bcrypt.compare(
          requestData.refresh_token,
          refreshTokenResult.data.hash_refresh_token
        );

        if (checkHashResult) {
          console.log("REFACTOR NEEDED");
          // const resultDA = await accountsDA.getByCI(requestData.email);

          const payload = { email: requestData.email, rol: null };
          // const payload = { email: requestData.email, rol: resultDA.data.type };
          const now = new Date();

          if (refreshTokenResult.data.date_expired.getTime() > now.getTime()) {
            result.access_token = helper.generateAccessToken(payload);
          } else result.code = resultsBL.TOKEN_EXPIRED;
        } else result.code = resultsBL.INVALID_CODE;
      } else result.code = resultsBL.INVALID_CODE;

      return result;
    } catch (err) {
      console.error(err);
      result = { code: resultsBL.ERROR };
    }
  },
};
