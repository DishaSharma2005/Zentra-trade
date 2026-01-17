import express from "express";

import  supabase from "../supabaseAdmin.js";


const router = express.Router();

/**
 * PLACE ORDER
 */
router.post("/", async (req, res) => {
  try {
    const { userId, symbol, qty, price, type } = req.body;

    if (!userId || !symbol || !qty || !price || !type) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const orderValue = qty * price;

    // 1️⃣ Get wallet
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (walletError || !wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    // 2️⃣ Balance check
    if (wallet.balance < orderValue) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // 3️⃣ Deduct balance
    const { error: updateError } = await supabase
      .from("wallets")
      .update({ balance: wallet.balance - orderValue })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    // 4️⃣ Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          symbol,
          qty,
          price,
          type,
          status: "filled",
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Order error:", err.message);
    res.status(500).json({ error: "Order failed" });
  }
});

/**
 * GET USER ORDERS
 */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("❌ Fetch orders error:", err.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

export default router;
