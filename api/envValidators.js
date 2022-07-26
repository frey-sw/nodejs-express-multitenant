function throwError(name) {
  console.error("[ERROR] - Env property missing = ", name);
}

const envVariables = [
  "url_backoffice_origin",
  "database_password_hash",
  "token_timeout_in_seconds",
  "refresh_token_expiration",
  "jwt_secret",
  "refresh_jwt_secret",
  "database_password_hash",
  "tenant_secret",
  "tenant_vector",
  "db_host",
  "db_user",
  "db_password",
  "db_database",
  "db_port",
  "db_root_usr",
  "db_root_password",
];

function validateEnvs() {
  for (const value of envVariables) {
    if (!process.env[value]) {
      throwError(value);
    }
  }
}

module.exports = validateEnvs;
