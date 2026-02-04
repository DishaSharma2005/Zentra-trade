import express from "express";
import supabase from "../supabaseAdmin.js";

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
    const { data, error } = await supabase
  .from("wallets")
  .select("balance")
  .eq("user_id", userId)
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();

    // 2️⃣ If wallet doesn't exist → create
    if (!wallet) {
      const { error } = await supabase.from("wallets").insert([
        {
          user_id,
          balance: 100000, // ₹1L demo balance
        },
      ]);

      if (error) throw error;
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
  console.log("🔥 /summary hit with userId:", userId);

  try {
    const { data, error } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single();

    console.log("🟢 Wallet query result:", data, error);

    if (error) throw error;

    return res.json({ balance: data.balance });
  } catch (err) {
    console.error("❌ Summary error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
