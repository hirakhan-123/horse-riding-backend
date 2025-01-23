const authValidation = require('./validation/auth');
const userValidation = require('./validation/user');
const horseValidation=require('./validation/horse')


module.exports = {
  authValidation,
  userValidation,
  horseValidation
};