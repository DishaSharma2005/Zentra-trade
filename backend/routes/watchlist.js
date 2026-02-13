import express from "express";
const router = express.Router();
import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

router.post("/prices", async (req, res) => {
  try {
    const { symbols } = req.body;
    const results = [];

    for (let symbol of symbols) {
      try {
        const quote = await yahooFinance.quote(`${symbol}.NS`);

        results.push({
          name: symbol,
          price: quote.regularMarketPrice,
          percent: quote.regularMarketChangePercent?.toFixed(2) + "%",
          isDown: quote.regularMarketChangePercent < 0,
        });

      } catch (err) {
        console.log("Failed symbol:", symbol);
      }
    }

    res.json(results);

  } catch (err) {
    res.status(500).json([]);
  }
});


export default router;
