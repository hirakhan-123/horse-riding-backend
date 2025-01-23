const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, required: true, default: 'pending' },
  sessionId: { type: String, required: true },
  horseId: { type: mongoose.Schema.Types.ObjectId, ref: 'horses', required: false },
  trainingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Training', required: false },
  slotTime: { type: String, required: false } 
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
