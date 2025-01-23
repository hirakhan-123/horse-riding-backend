const Joi = require('joi');


const signupUserValidationSchema = Joi.object({
  name: Joi.string().required(), 
  email: Joi.string().email().required(), 
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one letter and one number.',
    }),
  phone: Joi.string().required(), 
  role: Joi.string()
    .valid('admin', 'rider') 
    .required(),
});

const loginUserValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const getUserValidationSchema = Joi.object({
  userId: Joi.string().required(),
});

const updateUserValidationSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().optional(),
});


const userIdValidateSchema = Joi.object({
  userId: Joi.string().required(),
});


const getUserBankInfoValidationSchema = Joi.object({
  bankName: Joi.string().required(),
  accountNumber: Joi.string().required(),
});

const getUserBankFieldsValidationSchema = Joi.object({
  accountHolderName: Joi.string().required(),
  accountNumber: Joi.string().required(),
  ifscCode: Joi.string().required(),
});

module.exports = {
  signupUserValidationSchema,
  loginUserValidationSchema,
  getUserValidationSchema,
  updateUserValidationSchema,
  userIdValidateSchema,
  getUserBankInfoValidationSchema,
  getUserBankFieldsValidationSchema,
};
