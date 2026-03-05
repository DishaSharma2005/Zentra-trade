import express from "express";
import supabase from "../supabaseAdmin.js";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

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
        let quote = {};
        try {
          quote = await yahooFinance.quote(`${h.symbol}.NS`);
        } catch (e) {
          console.error(`Failed to fetch holding quote for ${h.symbol}:`, e.message);
        }

        const ltp = quote.regularMarketPrice || avg;

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
