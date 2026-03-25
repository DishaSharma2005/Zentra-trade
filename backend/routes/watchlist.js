import express from "express";
const router = express.Router();
import { getQuotes } from "../services/yahooPriceService.js";

router.post("/prices", async (req, res) => {
  try {
    const { symbols } = req.body;
    const results = [];

    // yahoo ticker mapping for symbols that differ from user-friendly names
    const tickerMap = {
      HUL: "HINDUNILVR",
      // add other aliases here if needed
    };

    // Map input symbols to their Yahoo ticker (.NS suffix for NSE)
    const symbolsToFetch = symbols.map(s => {
      const lookup = tickerMap[s] || s;
      return `${lookup}.NS`;
    });

    const quotes = await getQuotes(symbolsToFetch);
    
    // Map the results back to the original symbol names
    results.push(...symbols.map(originalSymbol => {
      const lookup = tickerMap[originalSymbol] || originalSymbol;
      const ticker = `${lookup}.NS`;
      const quote = quotes.find(q => q.symbol === ticker);

      if (!quote || quote.regularMarketPrice == null) {
        return { name: originalSymbol, price: null, percent: "-", isDown: false };
      }

      return {
        name: originalSymbol,
        price: quote.regularMarketPrice,
        percent: quote.regularMarketChangePercent?.toFixed(2) + "%",
        isDown: (quote.regularMarketChangePercent || 0) < 0,
      };
    }));

    res.json(results);

  } catch (err) {
    res.status(500).json([]);
  }
});

export default router;
