const Joi = require('joi');

const authValidationSchema = Joi.object({
  token: Joi.string().required(),
});

const validateAuthToken = (req, res, next) => {
  const { error } = authValidationSchema.validate(req.headers, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: 'Authentication error',
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

module.exports = {
  validateAuthToken,
};
