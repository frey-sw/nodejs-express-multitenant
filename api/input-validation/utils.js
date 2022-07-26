const Ajv = require('ajv');
const ajv = new Ajv();

module.exports = {
  compileSchema: schema => {
    const validate = ajv.compile(schema);
    return validate;
  }
};
