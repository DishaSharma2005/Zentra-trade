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

    const numQty = Number(qty);
    const numPrice = Number(price);
    const orderValue = numQty * numPrice;

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

    // � Validation & Lock phase
    if (type === "BUY") {
      if (wallet.balance < orderValue) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      // lock wallet
      await supabase
        .from("wallets")
        .update({ balance: wallet.balance - orderValue })
        .eq("user_id", userId);

      // insert BUY transaction upfront (realized PnL is null)
      const { error: txErr } = await supabase.from("transactions").insert([
        {
          user_id: userId,
          symbol,
          type: "BUY",
          quantity: numQty,
          price: numPrice,
          total_value: orderValue,
          realized_pnl: null,
        },
      ]);
      if (txErr) console.error("Tx Insert Error:", txErr);
    } else if (type === "SELL") {
      const holdingQty = Number(holding?.quantity || 0);

      if (!holding || holdingQty < numQty) {
        return res.status(400).json({ error: "Not enough holdings to sell" });
      }

      // lock holdings
      const newQty = holdingQty - numQty;
      if (newQty === 0) {
        await supabase.from("holdings").delete().eq("id", holding.id);
      } else {
        await supabase.from("holdings").update({ quantity: newQty }).eq("id", holding.id);
      }
    } else {
      return res.status(400).json({ error: "Invalid order type" });
    }

    // 3️⃣ Insert order as PENDING
    const { data: order } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          symbol,
          qty: numQty,
          price: numPrice,
          type,
          status: "PENDING",
        },
      ])
      .select()
      .single();

    res.json({ success: true, order });

    // 🟢 SIMULATE DELAY: Complete the trade after 8 seconds
    setTimeout(async () => {
      // Check if order was cancelled before completing
      const { data: currentOrder } = await supabase
        .from("orders")
        .select("status")
        .eq("id", order.id)
        .single();
        
      if (currentOrder && currentOrder.status === "CANCELLED") return;

      if (type === "BUY") {
        // Complete BUY: give user their new holdings
        if (holding) {
          const oldQty = Number(holding.quantity);
          const oldAvg = Number(holding.avg_price);
          const newQty = oldQty + numQty;
          const newAvg = (oldQty * oldAvg + numQty * numPrice) / newQty;

          await supabase
            .from("holdings")
            .update({ quantity: newQty, avg_price: newAvg })
            .eq("id", holding.id);
        } else {
          await supabase.from("holdings").insert([
            {
              user_id: userId,
              symbol,
              quantity: numQty,
              avg_price: numPrice,
            },
          ]);
        }
      } else if (type === "SELL") {
        // Complete SELL: give user their cash
        const holdingAvg = Number(holding.avg_price);
        const realizedPnL = (numPrice - holdingAvg) * numQty;
        
        // refresh wallet to avoid race conditions
        const { data: currentWallet } = await supabase
          .from("wallets")
          .select("balance")
          .eq("user_id", userId)
          .single();

        const latestWalletBalance = Number(currentWallet.balance) + numQty * numPrice;
        await supabase
          .from("wallets")
          .update({ balance: latestWalletBalance })
          .eq("user_id", userId);
          
        // insert SELL transaction with realized PnL
        await supabase.from("transactions").insert([
          {
            user_id: userId,
            symbol,
            type: "SELL",
            quantity: numQty,
            price: numPrice,
            total_value: numQty * numPrice,
            realized_pnl: realizedPnL,
          },
        ]);
      }

      // 4️⃣ Update order status to COMPLETED
      await supabase
        .from("orders")
        .update({ status: "COMPLETED" })
        .eq("id", order.id);
    }, 8000);

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
    if (order.status !== "PENDING") {
      return res.status(400).json({ 
        error: `Cannot cancel ${order.status} order. Only PENDING orders can be cancelled.` 
      });
    }

    // Since we locked wallet (for BUY) or holdings (for SELL), we need to revert it!
    const orderQty = Number(order.qty);
    const orderPrice = Number(order.price);

    if (order.type === "BUY") {
      // Revert wallet deduction
      const { data: wallet } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", order.user_id)
        .single();
        
      if (wallet) {
        await supabase
          .from("wallets")
          .update({ balance: Number(wallet.balance) + (orderQty * orderPrice) })
          .eq("user_id", order.user_id);
      }
    } else if (order.type === "SELL") {
      // Revert holding deduction
      const { data: holding } = await supabase
        .from("holdings")
        .select("*")
        .eq("user_id", order.user_id)
        .eq("symbol", order.symbol)
        .single();

      if (holding) {
        await supabase
          .from("holdings")
          .update({ quantity: Number(holding.quantity) + orderQty })
          .eq("id", holding.id);
      } else {
        // if holding was deleted because quantity went to 0, recreate it
        await supabase.from("holdings").insert([
          {
            user_id: order.user_id,
            symbol: order.symbol,
            quantity: orderQty,
            avg_price: orderPrice, // fallback, not perfect but okay for this prototype
          },
        ]);
      }
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
