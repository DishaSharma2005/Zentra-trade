import express from "express";
import supabase from "../supabaseAdmin.js";
import { calculatePortfolioSummary } from "../services/portfolioService.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Gemini (fallback to dummy key to prevent crash if backend starts without it)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "missing_key");

router.post("/", async (req, res) => {
  const { history, userId } = req.body;

  if (!history || !Array.isArray(history) || !userId) {
    return res.status(400).json({ error: "history array and userId required" });
  }

  try {
    // 1. Fetch User Data for RAG Context
    const { data: wallet } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single();

    const summary = await calculatePortfolioSummary(userId);

    const { data: orders } = await supabase
      .from("orders")
      .select("symbol, qty, price, type, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    // 2. Construct System Prompt
    const systemPrompt = `You are an expert financial advisor AI for a stock trading platform. 
You are talking to a user about their portfolio. Be concise, professional, and helpful. Use Markdown formatting.
Here is the user's current live financial profile:
- Wallet Balance: ₹${wallet ? Number(wallet.balance).toFixed(2) : 0}
- Total Portfolio Investment: ₹${summary.totalInvestment?.toFixed(2) || 0}
- Current Portfolio Value: ₹${summary.currentValue?.toFixed(2) || 0}
- Total Profit & Loss: ₹${summary.totalPnL?.toFixed(2) || 0} (${summary.totalPnLPercent?.toFixed(2) || 0}%)
- Today's Profit & Loss: ₹${summary.todayPnL?.toFixed(2) || 0}
- Best Stock: ${summary.bestStock || "None"} (Profit: ₹${summary.bestProfit?.toFixed(2) || 0})
- Worst Stock: ${summary.worstStock || "None"} (Loss: ₹${summary.worstLoss?.toFixed(2) || 0})

Recent Orders (Last 5):
${orders && orders.length > 0 ? orders.map(o => `- ${o.type} ${o.qty}x ${o.symbol} @ ₹${o.price} (${o.status})`).join('\n') : "None"}

IMPORTANT RULES:
- If the user asks general financial questions (like what is SIP, how to diversify), answer them helpfully.
- If the user asks about their specific portfolio, analyze the provided data context and give tailored advice.
- Never invent portfolio data. Only use the numbers provided above.
- You are chatting in a small popup widget, so keep responses concise (1-3 small paragraphs max) and use bullet points when enumerating.`;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "missing_key") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      });
      res.write(`data: ${JSON.stringify({ text: "⚠️ **Setup Required:** Please add your `GEMINI_API_KEY` to the `backend/.env` file and restart the backend server to enable the AI Financial Advisor." })}\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    }

    // 3. Call Gemini Model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt 
    });

    const contents = history.slice(-10).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });

    const result = await model.generateContentStream({ contents });
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (err) {
    console.error("Chat Error:", err.message);
    if (!res.headersSent) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      });
    }
    
    if (err.message.includes("API key not valid")) {
       res.write(`data: ${JSON.stringify({ text: "⚠️ **Invalid API Key:** The Gemini API key in your `.env` file appears to be invalid. Please check it and restart the server." })}\n\n`);
    } else {
       res.write(`data: ${JSON.stringify({ text: "⚠️ **Error:** Something went wrong connecting to the AI." })}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

export default router;