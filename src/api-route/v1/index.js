const express = require('express');
const router = express.Router();
const authModule = require('../../modules/auth') 
const eventModule=require('../../modules/events')
const { validateAuthToken } = require('../../middleware/validation/auth');
const horseModule = require ('../../modules/horses')
const bookingModule = require ('../../modules/booking')
const trainingModule = require('../../modules/training')
const paymentModule = require ('../../modules/payment')


router.use('/auth/protected-route', validateAuthToken, (req, res) => {
    res.json({ message: 'Access granted to protected route', user: req.user });
});
router.use('/training', trainingModule)
router.use('/booking', bookingModule)
router.use('/horse', horseModule)
router.use('/auth', authModule);
router.use('/event', eventModule);
router.use('/payment', paymentModule)

module.exports = router;


