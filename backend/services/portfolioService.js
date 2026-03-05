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
  //  3. Fetch Market Quotes
  // ===============================
  const quotePromises = holdings.map((stock) =>
    yahooFinance.quote(`${stock.symbol}.NS`).catch((err) => {
      // Catch silently or log softly to prevent Unhandled Promise Rejection
      console.error(`Failed to fetch quote for ${stock.symbol}:`, err.message);
      return null;
    })
  );

  const quotes = await Promise.allSettled(quotePromises);

  // ===============================
  //  4. Calculate Current Values
  // ===============================
  holdings.forEach((stock, index) => {
    const result = quotes[index];

    if (result.status !== "fulfilled" || !result.value) {
      console.log("Skipping symbol due to fetch failure:", stock.symbol);
      return;
    }

    const quote = result.value;

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