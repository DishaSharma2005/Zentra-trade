import express from "express";
const router = express.Router();
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

router.get("/", async (req, res) => {
  try {
    const symbols = ["^NSEI", "^BSESN"];
    const quotes = await yahooFinance.quote(symbols);
    
    const quoteArray = Array.isArray(quotes) ? quotes : [quotes];

    const results = {
      nifty: {
        points: quoteArray.find(q => q.symbol === "^NSEI")?.regularMarketPrice || 0,
        change: quoteArray.find(q => q.symbol === "^NSEI")?.regularMarketChangePercent || 0,
      },
      sensex: {
        points: quoteArray.find(q => q.symbol === "^BSESN")?.regularMarketPrice || 0,
        change: quoteArray.find(q => q.symbol === "^BSESN")?.regularMarketChangePercent || 0,
      }
    };

    res.json(results);
  } catch (err) {
    console.error("Index fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch indices" });
  }
});

export default router;
