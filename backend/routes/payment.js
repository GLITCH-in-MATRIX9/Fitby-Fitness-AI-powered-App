const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// payment route
router.post("/create-checkout-session", async (req, res) => {
    const { amount, currency } = req.body;
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency,
                    product_data: {
                        name: "FitBy Personalized Trainer Subscription",
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: "http://localhost:5173",
            cancel_url: "http://localhost:5173",
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;