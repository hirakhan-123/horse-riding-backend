require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Horse = require("../../model/horse");
const Training = require("../../model/training");
const Payment = require("../../model/payment");

exports.createCheckoutSession = async (userId, horseId, slotTime, amount) => {
  try {
    // Debugging logs
    console.log("Received in service - userId:", userId);
    console.log("Received in service - horseId:", horseId);
    console.log("Received in service - slotTime:", slotTime);
    console.log("Received in service - amount:", amount);

    if (!amount || typeof amount !== "number" || amount <= 0) {
      throw new Error("Invalid amount received in service function.");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Horse Riding Booking" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/layout/stripe-successful-payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-canceled`,
      metadata: { userId, horseId, slotTime },
    });

    console.log("Stripe session created successfully:", session.id);
    return { sessionId: session.id, url: session.url };
  } catch (error) {
    console.error("Error in payment service:", error);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
};

// Handle payment success
exports.handlePaymentSuccess = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Payment session not found" });
    }
    
    if (session.payment_status === "paid") {
      // Save payment record in the database
      const payment = await Payment.create({
        userId: session.metadata.userId,
        horseId: session.metadata.horseId,
        slotTime: session.metadata.slotTime,
        amount: session.amount_total / 100, // Convert from cents to dollars
        sessionId: session.id,
        status: "completed",
      });

      return payment;
    } else {
      return "Payment not completed";
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Payment completion failed: ${error.message}`);
  }
};

// Get all payments of a specific user
exports.getUserPayments = async (userId) => {
  try {
    return await Payment.find({ userId }).populate("horseId trainingId"); // Populate horseId and trainingId
  } catch (error) {
    throw new Error(`Error fetching user payments: ${error.message}`);
  }
};
