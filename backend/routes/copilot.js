import express from "express";
import supabase from "../supabaseAdmin.js";
import { getQuotes, getQuote } from "../services/yahooPriceService.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "missing_key");

// Available trading symbols in our application
const SYMBOLS = ["INFY", "ONGC", "TCS", "KPITTECH", "QUICKHEAL", "WIPRO", "RELIANCE", "HUL"];

router.post("/suggest", async (req, res) => {
  const { userId, mode, actionType, userPrompt } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // 1. Fetch live portfolio context
    const { data: wallet } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single();

    const { data: holdings } = await supabase
      .from("holdings")
      .select("*")
      .eq("user_id", userId);

    const { data: recentOrders } = await supabase
      .from("orders")
      .select("symbol, qty, price, type, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    // 2. Fetch live stock quotes
    const symbolsToFetch = SYMBOLS.map(s => s === "HUL" ? "HINDUNILVR.NS" : `${s}.NS`);
    const quotes = await getQuotes(symbolsToFetch);

    // 3. Format context payload for Gemini
    const walletBalance = wallet ? Number(wallet.balance) : 0;
    const activeHoldings = holdings || [];
    const formattedHoldings = activeHoldings.map(h => {
      const ticker = h.symbol === "HUL" ? "HINDUNILVR.NS" : `${h.symbol}.NS`;
      const q = quotes.find(quote => quote.symbol === ticker);
      const ltp = q ? q.regularMarketPrice : h.avg_price;
      return {
        symbol: h.symbol,
        quantity: h.quantity,
        avgPrice: h.avg_price,
        currentPrice: ltp,
        pnl: (ltp - h.avg_price) * h.quantity
      };
    });

    const marketQuotesList = SYMBOLS.map(sym => {
      const ticker = sym === "HUL" ? "HINDUNILVR.NS" : `${sym}.NS`;
      const q = quotes.find(quote => quote.symbol === ticker);
      return {
        symbol: sym,
        price: q ? q.regularMarketPrice : "N/A",
        change: q ? `${q.regularMarketChangePercent?.toFixed(2)}%` : "N/A"
      };
    });

    // 4. Construct System Prompt & Structured Schema instructions
    const systemPrompt = `You are a Cursor-style AI investing copilot agent. You operate in two modes:
- Manual Mode: Analyze data, answer investing questions, explain risk, and suggest general asset allocation.
- Copilot Mode: Actively suggest and draft realistic trade orders (BUY/SELL) that the user can execute in one click.

Current User & Market Context:
- Wallet Cash Balance: ₹${walletBalance.toFixed(2)}
- Current Holdings: ${JSON.stringify(formattedHoldings)}
- Live Market Price Feed: ${JSON.stringify(marketQuotesList)}
- Recent Orders: ${JSON.stringify(recentOrders || [])}

Active Copilot Configuration:
- Mode: ${mode} (Manual or Copilot)
- Action Requested: ${actionType} (options: "draft_trade", "analyze_portfolio", "check_risk", "chat")
- User Input: "${userPrompt || ""}"

IMPORTANT INSTRUCTIONS:
- You MUST respond in valid JSON format ONLY. Do not include markdown code block backticks (like \`\`\`json) in your raw response. Just output the raw JSON string.
- Provide a step-by-step array of "reasoningLogs" detailing your internal calculations (e.g. "[info] Fetching INFY quote...", "[ok] Risk checks passed").
- If mode is "Copilot" and the action is "draft_trade", you are encouraged to propose a trade by populating "draftedTrade".
- For a BUY trade: Ensure the total value of the trade (qty * price) does not exceed the user's cash balance.
- For a SELL trade: Ensure the user currently holds the required quantity of that specific symbol.
- Keep the "textResponse" (your primary reply) highly structured, concise, and in markdown.

JSON SCHEMA:
{
  "reasoningLogs": ["string", "string", ...],
  "textResponse": "markdown text string",
  "draftedTrade": null | {
    "symbol": "string",
    "action": "BUY" | "SELL",
    "qty": number,
    "price": number,
    "reason": "string"
  }
}`;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "missing_key") {
      return res.json({
        reasoningLogs: ["[error] Gemini API key not found in backend/.env"],
        textResponse: "⚠️ **Setup Required:** Please add your `GEMINI_API_KEY` to the `backend/.env` file to activate the AI Investing Copilot.",
        draftedTrade: null
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const rawResponse = result.response.text();
    const parsedData = JSON.parse(rawResponse);
    return res.json(parsedData);

  } catch (err) {
    console.error("Copilot Agent Error:", err.message);
    return res.status(500).json({
      error: err.message,
      reasoningLogs: ["[error] Internal execution crash", `[error] ${err.message}`],
      textResponse: "⚠️ **Error:** Something went wrong inside the Copilot Workspace agent.",
      draftedTrade: null
    });
  }
});

export default router;
