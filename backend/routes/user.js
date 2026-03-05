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
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id required" });
  }

  try {
    // 1️ Check wallet
    const { data: wallet, error } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 2️ If wallet doesn't exist → create
    if (!wallet) {
      const { error: insertError } = await supabase.from("wallets").insert([
        {
          user_id,
          balance: 0,
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
    // 1️ Wallet
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single();

    if (walletError) throw walletError;

    // 2️ Holdings
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
    // 1️ Wallet
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single();

    if (walletError) throw walletError;

    // 2️ Fetch holdings to calculate Total Investment and Current Value
    const { data: holdings, error: holdingsError } = await supabase
      .from("holdings")
      .select("*")
      .eq("user_id", userId);

    if (holdingsError) throw holdingsError;

    let totalInvestment = 0;
    let currentValue = 0;
    let todayPnL = 0;

    if (holdings.length > 0) {
      const quotePromises = holdings.map(stock =>
        yahooFinance.quote(`${stock.symbol}.NS`).catch((err) => {
          console.error(`Failed to fetch quote for ${stock.symbol}:`, err.message);
          return null; // Return null to handle gracefully below
        })
      );

      const quotes = await Promise.allSettled(quotePromises);

      holdings.forEach((stock, index) => {
        const qty = Number(stock.quantity) || 0;
        const avgPrice = Number(stock.avg_price) || 0;
        
        // Add to Total Investment based on current active holdings
        totalInvestment += (qty * avgPrice);

        const result = quotes[index];
        if (result.status !== "fulfilled") return;

        const quote = result.value;
        if (!quote || quote.regularMarketPrice == null) return;

        const currentPrice = Number(quote.regularMarketPrice);
        const previousClose = Number(quote.regularMarketPreviousClose);

        currentValue += qty * currentPrice;

        if (previousClose) {
          todayPnL += qty * (currentPrice - previousClose);
        }
      });
    }

    const totalPnL = currentValue - totalInvestment;
    const totalPnLPercent =
      totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

    return res.json({
      wallet,
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
