import express from "express";

import  supabase from "../supabaseAdmin.js";


const router = express.Router();

// PLACE ORDER
router.post("/", async (req, res) => {
  try {
    const { userId, symbol, qty, price, type } = req.body;

    if (!userId || !symbol || !qty || !price || !type) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const orderValue = qty * price;

    // 1️⃣ Fetch wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    // 2️⃣ Fetch holding
    const { data: holding } = await supabase
      .from("holdings")
      .select("*")
      .eq("user_id", userId)
      .eq("symbol", symbol)
      .single();

    // 🟢 BUY LOGIC
    if (type === "BUY") {
      if (wallet.balance < orderValue) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      await supabase
        .from("wallets")
        .update({ balance: wallet.balance - orderValue })
        .eq("user_id", userId);

      if (holding) {
        await supabase
          .from("holdings")
          .update({ quantity: holding.quantity + qty })
          .eq("id", holding.id);
      } else {
        await supabase.from("holdings").insert([
          {
            user_id: userId,
            symbol,
            quantity: qty,
          },
        ]);
      }
    }

    // 🔴 SELL LOGIC
    if (type === "SELL") {
      if (!holding || holding.quantity < qty) {
        return res.status(400).json({ error: "Not enough holdings to sell" });
      }

      const newQty = holding.quantity - qty;

      if (newQty === 0) {
        await supabase.from("holdings").delete().eq("id", holding.id);
      } else {
        await supabase
          .from("holdings")
          .update({ quantity: newQty })
          .eq("id", holding.id);
      }

      await supabase
        .from("wallets")
        .update({ balance: wallet.balance + orderValue })
        .eq("user_id", userId);
    }

    // 3️⃣ Insert order
    const { data: order } = await supabase
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
