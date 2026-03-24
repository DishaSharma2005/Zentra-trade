import express from "express";
const router = express.Router();
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

router.get("/", async (req, res) => {
  try {
    const [niftyData, sensexData] = await Promise.all([
      yahooFinance.quote("^NSEI"),
      yahooFinance.quote("^BSESN"),
    ]);

    const results = {
      nifty: {
        points: niftyData?.regularMarketPrice || 0,
        change: niftyData?.regularMarketChangePercent || 0,
      },
      sensex: {
        points: sensexData?.regularMarketPrice || 0,
        change: sensexData?.regularMarketChangePercent || 0,
      }
    };

    res.json(results);
  } catch (err) {
    console.error("❌ Index fetch error:", err);
    res.status(500).json({ error: "Failed to fetch indices" });
  }
});

export default router;
