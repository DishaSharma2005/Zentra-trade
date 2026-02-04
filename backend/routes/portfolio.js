import express from "express";
import supabase from "../supabaseAdmin.js";

const router = express.Router();

router.get("/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ Get holdings
    const { data: holdings, error: holdingsError } = await supabase
      .from("holdings")
      .select("*")
      .eq("user_id", userId);

    if (holdingsError) throw holdingsError;

    // 2️⃣ Get realized P&L
    const { data: pnlData, error: pnlError } = await supabase
      .from("transactions")
      .select("realized_pnl")
      .eq("user_id", userId)
      .not("realized_pnl", "is", null);

    if (pnlError) throw pnlError;

    const realizedPnL = pnlData.reduce(
      (sum, t) => sum + Number(t.realized_pnl),
      0
    );

    // 3️⃣ Calculate invested & current value
    let totalInvested = 0;
    let currentValue = 0;

    for (let h of holdings) {
      const avgPrice = Number(h.avg_price || 0);
      const qty = Number(h.quantity);

      // 🔹 TEMP LTP (mock)
      const ltp = avgPrice * 1.05;

      totalInvested += avgPrice * qty;
      currentValue += ltp * qty;
    }

    const unrealizedPnL = currentValue - totalInvested;
    const netPnL = realizedPnL + unrealizedPnL;

    res.json({
      totalInvested,
      currentValue,
      realizedPnL,
      unrealizedPnL,
      netPnL,
    });
  } catch (err) {
    console.error("❌ Portfolio summary error:", err.message);
    res.status(500).json({ error: "Failed to fetch portfolio summary" });
  }
});

export default router;
