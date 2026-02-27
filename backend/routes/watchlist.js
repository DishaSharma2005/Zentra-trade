import express from "express";
const router = express.Router();
import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

router.post("/prices", async (req, res) => {
  try {
    const { symbols } = req.body;
    const results = [];

    // yahoo ticker mapping for symbols that differ from user-friendly names
    const tickerMap = {
      HUL: "HINDUNILVR",
      // add other aliases here if needed
    };

    for (let symbol of symbols) {
      try {
        // convert to actual ticker if mapped
        const lookup = tickerMap[symbol] || symbol;
        const quote = await yahooFinance.quote(`${lookup}.NS`);

        results.push({
          name: symbol,
          price: quote.regularMarketPrice,
          percent: quote.regularMarketChangePercent?.toFixed(2) + "%",
          isDown: quote.regularMarketChangePercent < 0,
        });

      } catch (err) {
        console.log("Failed symbol:", symbol);
        // still push something so front-end doesn't hang, maybe nulls
        results.push({ name: symbol, price: null, percent: "-", isDown: false });
      }
    }

    res.json(results);

  } catch (err) {
    res.status(500).json([]);
  }
});


export default router;
