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
  const buyQty = Number(qty);
  const buyPrice = Number(price);
  const orderValue = buyQty * buyPrice;

  if (wallet.balance < orderValue) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  // wallet update
  await supabase
    .from("wallets")
    .update({ balance: wallet.balance - orderValue })
    .eq("user_id", userId);

  // transaction insert
  await supabase.from("transactions").insert([
    {
      user_id: userId,
      symbol,
      type: "BUY",
      quantity: buyQty,
      price: buyPrice,
      total_value: orderValue,
      realized_pnl: null,
    },
  ]);

  if (holding) {
    const oldQty = Number(holding.quantity);
    const oldAvg = Number(holding.avg_price);

    const newQty = oldQty + buyQty;
    const newAvg =
      (oldQty * oldAvg + buyQty * buyPrice) / newQty;

    await supabase
      .from("holdings")
      .update({
        quantity: newQty,
        avg_price: newAvg,
      })
      .eq("id", holding.id);
  } else {
    await supabase.from("holdings").insert([
      {
        user_id: userId,
        symbol,
        quantity: buyQty,
        avg_price: buyPrice,
      },
    ]);
  }
    }

    // 🔴 SELL LOGIC
    if (type === "SELL") {
      // coerce numeric values
      const sellQty = Number(qty);
      const sellPrice = Number(price);
      const holdingQty = Number(holding?.quantity || 0);
      const holdingAvg = Number(holding?.avg_price || 0);

      if (!holding || holdingQty < sellQty) {
        return res.status(400).json({ error: "Not enough holdings to sell" });
      }

      const newQty = holdingQty - sellQty;
      const realizedPnL = (sellPrice - holdingAvg) * sellQty;
      const newWalletBalance = Number(wallet.balance) + sellQty * sellPrice;

      // update or delete holding
      if (newQty === 0) {
        const { error: delErr } = await supabase
          .from("holdings")
          .delete()
          .eq("id", holding.id);
        if (delErr) throw delErr;
      } else {
        const { error: holdErr } = await supabase
          .from("holdings")
          .update({ quantity: newQty })
          .eq("id", holding.id);
        if (holdErr) throw holdErr;
      }

      // update wallet balance
      const { error: walletErr } = await supabase
        .from("wallets")
        .update({ balance: newWalletBalance })
        .eq("user_id", userId);
      if (walletErr) throw walletErr;

      // insert transaction with realized PnL
      const { error: txErr } = await supabase.from("transactions").insert([
        {
          user_id: userId,
          symbol,
          type: "SELL",
          quantity: sellQty,
          price: sellPrice,
          total_value: sellQty * sellPrice,
          realized_pnl: realizedPnL,
        },
      ]);
      if (txErr) throw txErr;
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

/**
 * CANCEL ORDER
 */
router.delete("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    // Fetch the order first
    const { data: order, error: fetchErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchErr || !order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Only allow cancellation of PENDING orders
    if (order.status !== "PENDING" && order.status !== "filled") {
      return res.status(400).json({ 
        error: `Cannot cancel ${order.status} order. Only PENDING orders can be cancelled.` 
      });
    }

    // Update order status to CANCELLED
    const { error: updateErr } = await supabase
      .from("orders")
      .update({ status: "CANCELLED" })
      .eq("id", orderId);

    if (updateErr) throw updateErr;

    console.log(`✅ Order ${orderId} cancelled successfully`);
    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (err) {
    console.error("❌ Cancel order error:", err.message);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

export default router;
