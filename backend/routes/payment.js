const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

const stripeSecretKey = process.env.STRIPE_SECRET;
if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET environment variable is missing.");
}
const stripe = require("stripe")(stripeSecretKey);

// payment route    
router.post("/create-checkout-session", async (req, res) => {
    const { planName, amount, currency } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency,
                    product_data: { name: planName },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: "https://fitby-fitness-ai-powered-app-in6l.vercel.app/personalized-trainer",
            cancel_url: "https://fitby-fitness-ai-powered-app-in6l.vercel.app/personalized-trainer",
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
