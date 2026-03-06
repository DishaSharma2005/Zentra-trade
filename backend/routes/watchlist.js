import express from "express";
const router = express.Router();
import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

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

    try {
      // Fetch all quotes in a single batch request
      const quotes = await yahooFinance.quote(symbolsToFetch);
      
      // Ensure quotes is an array (it might be a single object if only one symbol)
      const quoteArray = Array.isArray(quotes) ? quotes : [quotes];
      
      // Map the results back to the original symbol names
      results.push(...symbols.map(originalSymbol => {
        const lookup = tickerMap[originalSymbol] || originalSymbol;
        const ticker = `${lookup}.NS`;
        const quote = quoteArray.find(q => q.symbol === ticker);

        if (!quote) {
          return { name: originalSymbol, price: null, percent: "-", isDown: false };
        }

        return {
          name: originalSymbol,
          price: quote.regularMarketPrice,
          percent: quote.regularMarketChangePercent?.toFixed(2) + "%",
          isDown: (quote.regularMarketChangePercent || 0) < 0,
        };
      }));

    } catch (err) {
      console.error("Batch fetch failed for watchlist:", err.message);
      // Fallback: return empty results or nulls if entire batch fails
      symbols.forEach(s => results.push({ name: s, price: null, percent: "-", isDown: false }));
    }

    res.json(results);

  } catch (err) {
    res.status(500).json([]);
  }
});


export default router;
