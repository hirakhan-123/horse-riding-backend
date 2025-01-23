const paymentService = require('./payment.service');  
const Horse = require('../../model/horse');  

exports.createCheckoutSession = async (req, res) => {
    try {
        const userId = req.user.id;  // Ensure req.user is available
        const { horseId, slotTime } = req.body; 

        if (!horseId || !slotTime) {
            return res.status(400).json({ error: "Horse and slot must be selected." });
        }

        // Fetch the horse from DB
        const horse = await Horse.findById(horseId);
        if (!horse) {
            return res.status(400).json({ error: "Horse not found." });
        }

        // Validate if the slot is available
        const slot = horse.slots.find(s => s.time === slotTime && s.available);
        if (!slot) {
            return res.status(400).json({ error: "Slot not available." });
        }

        // Convert price to cents for Stripe
        const amount = horse.price * 100; 
        console.log("Horse price in cents:", amount);  

        if (amount <= 0) {
            return res.status(400).json({ error: "Invalid price for the selected slot." });
        }

        // 🛠️ FIX: Ensure all arguments are passed correctly!
        const session = await paymentService.createCheckoutSession(userId, horseId, slotTime, amount);

        res.status(200).json({ sessionId: session.sessionId, url: session.url });  
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: `Failed to create checkout session: ${error.message}` });
    }
};




// Handle payment success
exports.handlePaymentSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required.' });
        }

        const payment = await paymentService.handlePaymentSuccess(sessionId);
        res.json(payment); // Return updated payment record

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all payments of a specific user
exports.getUserPayments = async (req, res) => {
    try {
        const { userId } = req.params;
        const payments = await paymentService.getUserPayments(userId);
        res.json(payments); // Return user payments

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Helper function to validate ObjectId format
function isValidObjectId(id) {
    return /^[a-fA-F0-9]{24}$/.test(id);  // Regular expression to validate MongoDB ObjectId format
}
