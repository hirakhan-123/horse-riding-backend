const express = require('express');  // Import express
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../../model/payment');  // Import the payment model

// Webhook endpoint to listen for Stripe events
const webhookHandler = express.raw({ type: 'application/json' });  // Parse Stripe webhook as raw JSON

// This endpoint will receive the webhook events
exports.webhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];  // Retrieve the Stripe signature from headers
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;  // Your webhook secret from Stripe

    let event;

    // Verify the webhook signature to ensure it's from Stripe
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Update the payment status in the database once the payment is completed
        try {
            await Payment.findOneAndUpdate(
                { sessionId: session.id },
                { paymentStatus: 'completed' },
                { new: true }
            );
            console.log(`Payment completed for session ${session.id}`);
        } catch (err) {
            console.error('Error updating payment status:', err);
        }
    }

    // Return a success message to Stripe
    res.status(200).send('Webhook received');
};
