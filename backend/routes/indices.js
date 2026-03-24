import express from "express";
const router = express.Router();
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

router.get("/", async (req, res) => {
  try {
    const [niftyData, sensexData] = await Promise.allSettled([
      yahooFinance.quote("^NSEI"),
      yahooFinance.quote("^BSESN"),
    ]);

    const results = {
      nifty: {
        points:
          niftyData.status === "fulfilled"
            ? niftyData.value?.regularMarketPrice || 0
            : 0,
        change:
          niftyData.status === "fulfilled"
            ? niftyData.value?.regularMarketChangePercent || 0
            : 0,
      },
      sensex: {
        points:
          sensexData.status === "fulfilled"
            ? sensexData.value?.regularMarketPrice || 0
            : 0,
        change:
          sensexData.status === "fulfilled"
            ? sensexData.value?.regularMarketChangePercent || 0
            : 0,
      },
    };

    res.json(results); // ✅ ALWAYS respond
  } catch (err) {
    console.error("❌ Index crash:", err);

    // ✅ NEVER send 500 (very important)
    res.json({
      nifty: { points: 0, change: 0 },
      sensex: { points: 0, change: 0 },
    });
  }
});

export default router;
