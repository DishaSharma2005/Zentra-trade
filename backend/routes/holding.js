import express from "express";
import supabase from "../supabaseAdmin.js";
import { getQuote } from "../services/yahooPriceService.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: holdings, error } = await supabase
      .from("holdings")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    const enrichedHoldings = await Promise.all(
      holdings.map(async (h) => {
        const avg = Number(h.avg_price);
        const qty = Number(h.quantity);

        //  Add .NS for NSE stocks
        let quote = null;
        try {
          quote = await getQuote(`${h.symbol}.NS`);
        } catch (e) {
          console.error(`Failed to fetch holding quote for ${h.symbol}:`, e.message);
        }

        const ltp = quote ? (quote.regularMarketPrice || avg) : avg;

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
      })
    );

    res.json(enrichedHoldings);
  } catch (err) {
    console.error("❌ Holdings error:", err.message);
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});


export default router;
