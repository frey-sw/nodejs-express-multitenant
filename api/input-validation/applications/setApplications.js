const utils = require("../utils");

const schema = {
  required: ["amount", "dues"],
  type: "object",
  properties: {
    amount: {
      type: "number",
    },
    payments: {
      type: "number",
    },
    dues: {
      type: "number",
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
