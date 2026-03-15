import express from "express";
import { stripe } from "../services/stripeService.js";
import supabase from "../supabaseAdmin.js";

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const { amount, userId } = req.body;

  try {
    const FRONTEND_URL = process.env.FRONTEND_URL || "https://zentra-trade.vercel.app";
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
      success_url: `${FRONTEND_URL}/dashboard/wallet-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/dashboard/wallet-cancel`,
      metadata: { userId },
    });

    res.json({ url: session.url });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post(
  "/webhook", async (req, res) => {
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

       //Existing payment check to prevent duplicates (e.g. if webhook is retried)
        const { data: existingPayment } = await supabase
        .from("payments")
        .select("*")
        .eq("stripe_session_id", session.id)
        .single();

      if (existingPayment) {
        return res.json({ received: true }); // already processed
      }


      // Get wallet
  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", userId)
    .single();

  // Update wallet
  await supabase
    .from("wallets")
    .update({ balance: wallet.balance + amount })
    .eq("user_id", userId);

  // Insert payment record
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
  });
// optional endpoint used by payment-success page to double-check status
router.post("/verify-session", async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "sessionId required" });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const isPaid = session.payment_status === "paid";

    if (isPaid) {
      const userId = session.metadata.userId;
      const amount = session.amount_total / 100;

      // 💳 Check if this payment was ALREADY processed
      const { data: existingPayment } = await supabase
        .from("payments")
        .select("*")
        .eq("stripe_session_id", sessionId)
        .single();

      if (!existingPayment) {
        // Fallback update
        const { data: wallet } = await supabase
          .from("wallets")
          .select("balance")
          .eq("user_id", userId)
          .single();

        if (wallet) {
          await supabase
            .from("wallets")
            .update({ balance: Number(wallet.balance) + amount })
            .eq("user_id", userId);

          await supabase.from("payments").insert([
            {
              user_id: userId,
              amount,
              stripe_session_id: sessionId,
              status: "completed",
            },
          ]);
        }
      }
    }

    return res.json({ success: isPaid });
  } catch (err) {
    console.error("verify-session error", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET user payment history
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { data: payments, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(payments);
  } catch (err) {
    console.error("Fetch payment history error:", err.message);
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
});

export default router;