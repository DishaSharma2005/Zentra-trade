import express from "express";
import supabase from "../supabaseAdmin.js";

const router = express.Router();

/**
 * GET USER HOLDINGS
 */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("holdings")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("❌ Holdings error:", err.message);
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

export default router;
