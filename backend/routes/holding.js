import express from "express";
import supabase from "../supabaseAdmin.js";
import { getQuote } from "../services/yahooPriceService.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    let { data: holdings, error } = await supabase
      .from("holdings")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    // --- AUTO CONSOLIDATE DUPLICATE HOLDINGS ---
    // Since previous bugs spawned multiple rows for the same symbol, we merge them here.
    const consolidatedMap = {};
    const toDelete = [];

    for (const h of holdings) {
      if (!consolidatedMap[h.symbol]) {
        consolidatedMap[h.symbol] = h;
      } else {
        const primary = consolidatedMap[h.symbol];
        const oldQty = Number(primary.quantity);
        const oldAvg = Number(primary.avg_price);
        const addQty = Number(h.quantity);
        const addAvg = Number(h.avg_price);

        const newQty = oldQty + addQty;
        // avoid division by zero
        const newAvg = newQty > 0 ? ((oldQty * oldAvg + addQty * addAvg) / newQty) : 0;

        primary.quantity = newQty;
        primary.avg_price = newAvg;
        
        toDelete.push(h.id);
      }
    }

    if (toDelete.length > 0) {
       console.log(`🧹 Auto-consolidating ${toDelete.length} duplicate holdings for user ${userId}`);
       // Update primary rows
       for (const symbol in consolidatedMap) {
         await supabase.from("holdings").update({
           quantity: consolidatedMap[symbol].quantity,
           avg_price: consolidatedMap[symbol].avg_price
         }).eq("id", consolidatedMap[symbol].id);
       }
       // Delete merged duplicates
       for (const id of toDelete) {
         await supabase.from("holdings").delete().eq("id", id);
       }
       // Refresh list
       holdings = Object.values(consolidatedMap);
    }

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
