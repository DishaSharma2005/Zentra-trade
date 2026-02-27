import express from "express";
import { stripe } from "../services/stripeService.js";
import supabase from "../supabaseAdmin.js";

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const { amount, userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Wallet Top-up" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      // keep user inside dashboard so authentication persists
      success_url: `${process.env.FRONTEND_URL}/dashboard/wallet-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/wallet-cancel`,
      metadata: { userId },
    });

    res.json({ url: session.url });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const amount = session.amount_total / 100;

      // Update wallet
      const { data: wallet } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", userId)
        .single();

      await supabase
        .from("wallets")
        .update({ balance: wallet.balance + amount })
        .eq("user_id", userId);

      // Save payment record
      await supabase.from("payments").insert([
        {
          user_id: userId,
          amount,
          stripe_session_id: session.id,
          status: "completed",
        },
      ]);
    }

    res.json({ received: true });
  }
);

// optional endpoint used by payment-success page to double-check status
router.post("/verify-session", async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "sessionId required" });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // if paid, return success
    if (session.payment_status === "paid") {
      // update wallet if not already done by webhook
      const userId = session.metadata.userId;
      const amount = session.amount_total / 100;

      const { data: wallet } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", userId)
        .single();

      if (wallet) {
        await supabase
          .from("wallets")
          .update({ balance: wallet.balance + amount })
          .eq("user_id", userId);
      }

      return res.json({ success: true });
    }
    res.json({ success: false });
  } catch (err) {
    console.error("verify-session error", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;