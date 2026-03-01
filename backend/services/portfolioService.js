import supabase from "../supabaseAdmin.js";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

export const calculatePortfolioSummary = async (userId) => {
  const { data: holdings, error } = await supabase
    .from("holdings")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  if (!holdings || holdings.length === 0) {
    return {
      totalInvestment: 0,
      currentValue: 0,
      totalPnL: 0,
      totalPnLPercent: 0,
      todayPnL: 0,
      bestStock: null,
      bestProfit: 0,
      worstStock: null,
      worstLoss: 0,
    };
  }

  let totalInvestment = 0;
  let currentValue = 0;
  let todayPnL = 0;

  let bestStock = null;
  let bestProfit = -Infinity;

  let worstStock = null;
  let worstLoss = Infinity;

  // Fetch all quotes in parallel
  const quotePromises = holdings.map((stock) =>
    yahooFinance.quote(`${stock.symbol}.NS`)
  );

  const quotes = await Promise.allSettled(quotePromises);

  holdings.forEach((stock, index) => {
    const result = quotes[index];
    
    if (result.status !== "fulfilled") {
      console.log("Failed symbol:", stock.symbol);
      return;
    }

    const quote = result.value;

    const qty = Number(stock.quantity) || 0;
    const avg = Number(stock.avg_price) || 0;

  const currentPrice = quote?.regularMarketPrice;
  const previousClose = quote?.regularMarketPreviousClose;
  
  if (currentPrice == null) return; 

    const investment = qty * avg;
    const current = qty * currentPrice;
    const stockProfit = current - investment;

    totalInvestment += investment;
    currentValue += current;

    if (previousClose) {
      todayPnL += qty * (currentPrice - previousClose);
    }

    // Best stock logic
    if (stockProfit > bestProfit) {
      bestProfit = stockProfit;
      bestStock = stock.symbol;
    }

    // Worst stock logic
    if (stockProfit < worstLoss) {
      worstLoss = stockProfit;
      worstStock = stock.symbol;
    }
  });

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