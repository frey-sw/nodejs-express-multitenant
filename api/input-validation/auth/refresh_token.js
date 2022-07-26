const utils = require("../utils");

const schema = {
  required: ["refresh_token"],
  type: "object",
  properties: {
    refresh_token: { type: "string" },
  },
};

const schemaValidator = utils.compileSchema(schema);

module.exports = (data) => {
  let result = {};
  result.isValid = schemaValidator(data);
  result.errors = schemaValidator.errors;
  return result;
};
