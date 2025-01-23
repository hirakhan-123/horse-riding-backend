const { addEventValidationSchema, updateEventValidationSchema } = require('./event-validation.schema');

// Middleware to validate add event request
exports.validateAddEventRequest = (req, res, next) => {
  const { error } = addEventValidationSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

// Middleware to validate update event request
exports.validateUpdateEventRequest = (req, res, next) => {
  const { error } = updateEventValidationSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};
