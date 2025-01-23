const express = require('express');
const router = express.Router();
const bookingController = require('./booking.controller');
const { authenticate } = require('../../middleware/authenticate');
const { requireAdmin } = require('../../middleware/permissions/role-middleware');

router.post('/create-booking', authenticate, bookingController.createBooking);
router.get('/user-bookings', authenticate, bookingController.getUserBookings);
router.get('/all-bookings', [authenticate, requireAdmin], bookingController.getAllBookings);
router.patch('/update-booking-status', [authenticate, requireAdmin], bookingController.updateBookingStatus);
router.delete('/cancel-booking', authenticate, bookingController.cancelBooking);

module.exports = router;
