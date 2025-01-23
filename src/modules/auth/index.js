const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { authenticate } = require('../../middleware/authenticate');
const { validateAuthToken } = require('../../middleware/validation/auth');
const {verifyAdmin,requireAdmin} = require('../../middleware/permissions/role-middleware')
const {validateUserSignupRequest,validateUserUpdationSchema}= require('../../middleware/validation/user')

router.post('/signup',[validateUserSignupRequest], authController.signup);
router.post('/login', authController.login);
router.post('/login-admin', authController.loginAdmin);
router.get('/user-profile', [validateAuthToken], authController.getUserProfile);
router.get('/get-login-user', authController.getLoginUsers);
router.delete('/delete-rider/:id', [authenticate], authController.deleteRider);
router.get('/user/:id/verify/:token', authController.verifyToken);
router.patch('/update/:id',[authenticate], authController.updateUser);

module.exports = router;
