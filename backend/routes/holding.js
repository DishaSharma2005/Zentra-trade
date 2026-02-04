import express from "express";
import supabase from "../supabaseAdmin.js";

const router = express.Router();

const PRICE_MAP = {
  INFY: 1555.45,
  TCS: 3194.8,
  KPITTECH: 266.45,
  ONGC: 116.8,
};

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: holdings, error } = await supabase
      .from("holdings")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

   const enrichedHoldings = holdings.map((h) => {
  const avg = Number(h.avg_price);
  const qty = Number(h.quantity);

  const ltp = PRICE_MAP[h.symbol] || avg;
  const invested = avg * qty;
  const current = ltp * qty;
  const pnl = current - invested;
  const pnlPercent = invested
    ? ((pnl / invested) * 100).toFixed(2)
    : "0.00";

  return {
    ...h,
    avg_price: avg,
    quantity: qty,
    current_price: ltp,
    invested,
    current,
    pnl,
    pnlPercent,
  };
});


    res.json(enrichedHoldings);
  } catch (err) {
    console.error("❌ Holdings error:", err.message);
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

export default router;
