const utils = require("../utils");
const applicationsOrderByEnum = require("../../business/enums/applications/applications-order-by");
const applicationsFilterByEnum = require("../../business/enums/applications/applications-filter-by");
const orderDirectionEnum = require("../../business/enums/shared/order-direction");

const schema = {
  required: ["page", "size"],
  type: "object",
  properties: {
    page: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    size: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    orderBy: {
      type: "string",
      enum: Object.values(applicationsOrderByEnum),
    },
    orderDirection: {
      type: "string",
      enum: Object.values(orderDirectionEnum),
    },
    filterBy: {
      type: "string",
      enum: Object.values(applicationsFilterByEnum),
    },
    searchText: {
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
