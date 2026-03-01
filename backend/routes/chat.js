import express from "express";
import supabase from "../supabaseAdmin.js";
import { calculatePortfolioSummary } from "../services/portfolioService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ error: "Message and userId required" });
  }

  const lowerMsg = message.toLowerCase();

  const contains = (keywords) =>
    keywords.some((word) => lowerMsg.includes(word));

  try {
    // =========================
    //  WALLET
    // =========================
    if (contains(["wallet", "balance", "money"])) {
      const { data, error } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      return res.json({
        reply: `💰 Your wallet balance is ₹${Number(
          data.balance
        ).toFixed(2)}`
      });
    }

    // =========================
    //  PORTFOLIO SUMMARY
    // =========================
    if (contains(["portfolio", "investment", "summary"])) {
      const summary = await calculatePortfolioSummary(userId);

      if (!summary || summary.totalInvestment === 0) {
        return res.json({
          reply: "You don't have any holdings yet."
        });
      }

      return res.json({
        reply: `
📊 Portfolio Overview:

💰 Invested: ₹${summary.totalInvestment.toFixed(2)}
📈 Current Value: ₹${summary.currentValue.toFixed(2)}
📊 Total P&L: ₹${summary.totalPnL.toFixed(2)}
📉 Today's P&L: ₹${summary.todayPnL.toFixed(2)}
📈 Return: ${summary.totalPnLPercent.toFixed(2)}%
`
      });
    }

    // =========================
    //  PROFIT / LOSS
    // =========================
    if (contains(["profit", "loss", "gain", "p&l"])) {
      const summary = await calculatePortfolioSummary(userId);

      if (!summary || summary.totalInvestment === 0) {
        return res.json({
          reply: "You don't have any holdings yet."
        });
      }

      return res.json({
        reply: `📊 Your total P&L is ₹${summary.totalPnL.toFixed(
          2
        )} (${summary.totalPnLPercent.toFixed(2)}%)`
      });
    }

    // =========================
    //  TODAY'S PERFORMANCE
    // =========================
    if (contains(["today"])) {
      const summary = await calculatePortfolioSummary(userId);

      if (!summary || summary.totalInvestment === 0) {
        return res.json({
          reply: "You don't have any holdings yet."
        });
      }

      return res.json({
        reply: `📉 Today's P&L: ₹${summary.todayPnL.toFixed(2)}`
      });
    }

    // =========================
    //  BEST STOCK
    // =========================
    if (contains(["best", "top"])) {
      const summary = await calculatePortfolioSummary(userId);

      if (!summary.bestStock) {
        return res.json({
          reply: "You don't have any holdings yet."
        });
      }

      return res.json({
        reply: `🏆 Best performing stock: ${summary.bestStock}
Profit: ₹${summary.bestProfit.toFixed(2)}`
      });
    }

    // =========================
    //  WORST STOCK
    // =========================
    if (contains(["worst"])) {
      const summary = await calculatePortfolioSummary(userId);

      if (!summary.worstStock) {
        return res.json({
          reply: "You don't have any holdings yet."
        });
      }

      return res.json({
        reply: `📉 Worst performing stock: ${summary.worstStock}
Loss: ₹${summary.worstLoss.toFixed(2)}`
      });
    }

    // =========================
    // 📑 LAST 5 ORDERS
    // =========================
    if (contains(["orders","order", "trades"])) {
  const { data, error } = await supabase
    .from("orders")
    .select("symbol, qty, price, type, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;

  if (!data || data.length === 0) {
    return res.json({
      reply: "You have no orders yet."
    });
  }

  const orderText = data
    .map(
      (o) =>
        `${o.symbol} | ${o.type?.toUpperCase()} | ${o.qty} shares @ ₹${o.price} (${o.status})`
    )
    .join("\n");

  return res.json({
    reply: `📑 Your last 5 orders:\n\n${orderText}`
  });
}
    // =========================
    // ❓ DEFAULT
    // =========================
    return res.json({
      reply:
        "I can help with portfolio, profit, today's performance, wallet balance, best/worst stock, or recent orders."
    });

  } catch (err) {
    console.error("Chat Error:", err);
    return res.status(500).json({
      error: "Something went wrong"
    });
  }
});

export default router;