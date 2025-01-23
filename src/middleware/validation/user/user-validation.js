// const {
//     signupUserValidationSchema,
//     loginUserValidationSchema,
//     getUserValidationSchema,
//     updateUserValidationSchema,
//     userIdValidateSchema,
//     updateUserValidationSchema,
//     getUserBankInfoValidationSchema,
//     getUserBankFieldsValidationSchema,
//   } = require('./user-validation.schema'); 
  
//   const validateUserSignupRequest = (req, res, next) => {
//     const { error } = signupUserValidationSchema.validate(req.body, { abortEarly: false });
  
//     if (error) {
//       return res.status(400).json({
//         message: 'Validation error',
//         details: error.details.map((detail) => detail.message),
//       });
//     }
//     next();
//   };
  
//   // Middleware to validate login request
//   const validateLoginRequest = (req, res, next) => {
//     const { error } = loginUserValidationSchema.validate(req.body, { abortEarly: false });
  
//     if (error) {
//       return res.status(400).json({
//         message: 'Validation error',
//         details: error.details.map((detail) => detail.message),
//       });
//     }
//     next();
//   };
  
//   // Middleware to validate userId in the request parameters
//   const validateUserIdRequest = (req, res, next) => {
//     const { error } = userIdValidateSchema.validate(req.params, { abortEarly: false });
  
//     if (error) {
//       return res.status(400).json({
//         message: 'Validation error',
//         details: error.details.map((detail) => detail.message),
//       });
//     }
//     next();
//   };
  
//   // Middleware to validate patch user request
//   const validateUserUpdationRequest = (req, res, next) => {
//     const { error } = updateUserValidationSchema.validate(req.body, { abortEarly: false });
  
//     if (error) {
//       return res.status(400).json({
//         message: 'Validation error',
//         details: error.details.map((detail) => detail.message),
//       });
//     }
//     next();
//   };
  
//   module.exports = {
//     validateUserSignupRequest,
//     validateLoginRequest,
//     validateUserIdRequest,
//     validateUserUpdationRequest,
//   };
  