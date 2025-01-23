const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middleware/authenticate");
const {
  requireAdmin,
} = require("../../middleware/permissions/role-middleware");
const paymentController = require("./payment.controller");
const paymentWebhook = require("./payment-webhook");

router.post(
  "/create-checkout-session",
  [authenticate],
  paymentController.createCheckoutSession
);

// Mark payment as completed (after successful Stripe payment)
router.post(
  "/payment-success",
  [authenticate],
  paymentController.handlePaymentSuccess
);

// Get all payments of a specific user
router.get("/user/:userId", paymentController.getUserPayments);
// router.post('/webhook', paymentWebhook.webhook);

module.exports = router;
