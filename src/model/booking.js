const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../constant');  // Adjust the path if necessary

const bookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
  },
  horse: {
    type: Schema.Types.ObjectId,
    ref: 'horses',  // Reference to the Horse model
  },
  training: {
    type: Schema.Types.ObjectId,
    ref: 'Training',  // Reference to the Training model
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.CANCELLED],
    default: BOOKING_STATUS.PENDING,
  },
  paymentStatus: {
    type: String,
    enum: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.PAID],
    default: PAYMENT_STATUS.PENDING,
  },
  amount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
