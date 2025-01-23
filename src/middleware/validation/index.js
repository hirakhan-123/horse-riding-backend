const {
    validateUserSignupRequest,
    validateLoginRequest,
    validateUserIdRequest,
    validateUserUpdationRequest,
  } = require('../validation/user');
  const { validateAuthToken } = require('../validation/auth')
  
  module.exports = {
    validateUserSignupRequest,
    validateLoginRequest,
    validateUserIdRequest,
    validateUserUpdationRequest,
    validateAuthToken
  };
  