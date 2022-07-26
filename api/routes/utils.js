module.exports = {
    validateInput: function(data, validationFunction, res, next) {
      var validationResult = validationFunction(data);
      if (validationResult.isValid) {
        next();
      } else {
        console.error(validationResult.errors);
        res.sendStatus(400);
      }
    }
  };
  