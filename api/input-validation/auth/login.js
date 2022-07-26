const utils = require("../utils");

const schema = {
  required: ["ci", "password"],
  type: "object",
  properties: {
    ci: {
      type: "number",
    },
    password: {
      type: "string",
    },
  },
};

const schemaValidator = utils.compileSchema(schema);

module.exports = (data) => {
  let result = {};
  result.isValid = schemaValidator(data);
  result.errors = schemaValidator.errors;
  return result;
};
