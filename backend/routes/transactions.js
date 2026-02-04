import express from "express";
import supabase from "../supabaseAdmin.js";

const router = express.Router();

// GET USER TRANSACTIONS
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Fetch transactions error:", error.message);
    return res.status(500).json({ error: "Failed to fetch transactions" });
  }

  res.json(data);
});

export default router;
