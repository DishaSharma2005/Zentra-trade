import supabase from "../supabaseAdmin.js";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

export const calculatePortfolioSummary = async (userId) => {
  // ===============================
  //  1. Fetch Holdings
  // ===============================
  const { data: holdings, error: holdingsError } = await supabase
    .from("holdings")
    .select("*")
    .eq("user_id", userId);

  if (holdingsError) throw holdingsError;

  // ===============================
  //  2. Fetch Total BUY Investment
  // ===============================
  const { data: buyOrders, error: orderError } = await supabase
  .from("orders")
  .select("qty, price")
  .eq("user_id", userId)
  .eq("type", "BUY")
  .eq("status", "filled");

  if (orderError) throw orderError;

  let totalInvestment = 0;

  buyOrders?.forEach((order) => {
    totalInvestment += Number(order.qty) * Number(order.price);
  });

  // If no holdings, return clean summary
  if (!holdings || holdings.length === 0) {
    return {
      totalInvestment,
      currentValue: 0,
      totalPnL: -totalInvestment,
      totalPnLPercent: totalInvestment > 0 ? -100 : 0,
      todayPnL: 0,
      bestStock: null,
      bestProfit: 0,
      worstStock: null,
      worstLoss: 0,
    };
  }

  let currentValue = 0;
  let todayPnL = 0;

  let bestStock = null;
  let bestProfit = -Infinity;

  let worstStock = null;
  let worstLoss = Infinity;

  // ===============================
  //  3. Fetch Market Quotes (Batch)
  // ===============================
  const symbolsToFetch = holdings.map((h) => `${h.symbol}.NS`);
  let quotes = [];

  try {
    const rawQuotes = await yahooFinance.quote(symbolsToFetch);
    quotes = Array.isArray(rawQuotes) ? rawQuotes : [rawQuotes];
  } catch (err) {
    console.error("Batch fetch failed for portfolio summary:", err.message);
    // If entire batch fails, quotes remains empty array, calculations will handle it
  }

  // ===============================
  //  4. Calculate Current Values
  // ===============================
  holdings.forEach((stock) => {
    const quote = quotes.find(q => q.symbol === `${stock.symbol}.NS`);

    if (!quote) {
      console.log("Skipping symbol due to fetch failure or missing quote:", stock.symbol);
      return;
    }

    const qty = Number(stock.quantity) || 0;
    const avg = Number(stock.avg_price) || 0;

    const currentPrice = quote?.regularMarketPrice;
    const previousClose = quote?.regularMarketPreviousClose;

    if (currentPrice == null) return;

    const current = qty * currentPrice;
    const investedInThisStock = qty * avg;
    const stockProfit = current - investedInThisStock;

    currentValue += current;

    if (previousClose != null) {
      todayPnL += qty * (currentPrice - previousClose);
    }

    // Best performing stock
    if (stockProfit > bestProfit) {
      bestProfit = stockProfit;
      bestStock = stock.symbol;
    }

    // Worst performing stock
    if (stockProfit < worstLoss) {
      worstLoss = stockProfit;
      worstStock = stock.symbol;
    }
  });

  // ===============================
  //  5. Final Calculations
  // ===============================
  const totalPnL = currentValue - totalInvestment;

  const totalPnLPercent =
    totalInvestment > 0
      ? (totalPnL / totalInvestment) * 100
      : 0;

  return {
    totalInvestment,
    currentValue,
    totalPnL,
    totalPnLPercent,
    todayPnL,
    bestStock,
    bestProfit: bestProfit === -Infinity ? 0 : bestProfit,
    worstStock,
    worstLoss: worstLoss === Infinity ? 0 : worstLoss,
  };
};