const enumResultsBL = require("../db/enums/result_status_data_access");
const tenantBL = require("../business/tenants");
const userTypesEnum = require("../business/enums/users/user_types");
const cipher = require("../shared/cipher");
const { setTenantConn } = require("../knexfile");

module.exports = async (req, res, next) => {
  const decoded = req.decodedToken;
  if (!decoded) {
    return res.status(403).json({ status: enumResultsBL.FORBIDDEN });
  }
  try {
    req.userCi = decoded.user_ci;
    req.userRol = decoded.rol;
    req.userEmail = decoded.email;

    if (req.userRol !== userTypesEnum.ADMINISTRADOR) {
      const tenantSlug = JSON.parse(cipher.decrypt(decoded.company));
      const tenantConnection = await tenantBL.getInfoAndValidateCI(
        req.userCi,
        tenantSlug.tenant_id
      );

      req.tenantId = tenantConnection.data.id;

      // Sets globally the tenant connection for all other requests
      await setTenantConn(tenantConnection.data);
    }
  } catch (error) {
    console.error("[ERROR] - Authorization token validation failed.", error);
    return res.status(403).json({ status: enumResultsBL.FORBIDDEN });
  }
  next();
};
