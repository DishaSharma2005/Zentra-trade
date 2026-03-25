import express from "express";
const router = express.Router();
import { getQuote } from "../services/yahooPriceService.js";

router.get("/", async (req, res) => {
  try {
    const [niftyData, sensexData] = await Promise.all([
      getQuote("^NSEI"),
      getQuote("^BSESN"),
    ]);

    const results = {
      nifty: {
        points: niftyData ? niftyData.regularMarketPrice || 0 : 0,
        change: niftyData ? niftyData.regularMarketChangePercent || 0 : 0,
      },
      sensex: {
        points: sensexData ? sensexData.regularMarketPrice || 0 : 0,
        change: sensexData ? sensexData.regularMarketChangePercent || 0 : 0,
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
