import express from "express";
import supabase from "../supabaseAdmin.js";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

const router = express.Router();

/**
 * POST /api/user/init
 * Body: { user_id }
 */
router.post("/init", async (req, res) => {
      console.log("🔥 /api/user/init hit", req.body);
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id required" });
  }

  try {
    // 1️⃣ Check wallet
    const { data: wallet, error } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 2️⃣ If wallet doesn't exist → create
    if (!wallet) {
      const { error: insertError } = await supabase.from("wallets").insert([
        {
          user_id,
          balance: 100000, // ₹1L demo balance
        },
      ]);

      if (insertError) throw insertError;
    }

    return res.json({
      success: true,
      message: "User initialized",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

/**
 * GET /api/user/dashboard/:userId
 * Returns wallet + holdings
 */
router.get("/dashboard/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "userId required" });
  }

  try {
    // 1️⃣ Wallet
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single();

    if (walletError) throw walletError;

    // 2️⃣ Holdings
    const { data: holdings, error: holdingsError } = await supabase
      .from("holdings")
      .select("symbol, quantity")
      .eq("user_id", userId);

    if (holdingsError) throw holdingsError;

    return res.json({
      wallet,
      holdings,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/summary/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single();

    if (walletError) throw walletError;

    const { data: holdings, error: holdingsError } = await supabase
      .from("holdings")
      .select("*")
      .eq("user_id", userId);

    if (holdingsError) throw holdingsError;

    let totalInvestment = 0;
    let currentValue = 0;
    let todayPnL = 0;

    for (const stock of holdings) {
      try {
        const qty = Number(stock.quantity);
        const avg = Number(stock.avg_price);

        const quote = await yahooFinance.quote(`${stock.symbol}.NS`);

        const currentPrice = Number(quote.regularMarketPrice || 0);
        const previousClose = Number(quote.regularMarketPreviousClose || 0);

        totalInvestment += qty * avg;
        currentValue += qty * currentPrice;
        todayPnL += qty * (currentPrice - previousClose);

      } catch (err) {
        console.log("Failed symbol:", stock.symbol);
        continue;
      }
    }

    totalInvestment = Number(totalInvestment) || 0;
    currentValue = Number(currentValue) || 0;
    todayPnL = Number(todayPnL) || 0;

    const totalPnL = currentValue - totalInvestment;
    const totalPnLPercent =
      totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

    return res.json({
      totalInvestment,
      currentValue,
      totalPnL,
      totalPnLPercent,
      todayPnL,
    });


  } catch (err) {
    console.error("❌ Summary error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
