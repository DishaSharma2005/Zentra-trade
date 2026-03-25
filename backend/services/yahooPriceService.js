import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

// Cache map: symbol -> { regularMarketPrice, regularMarketChangePercent, fetchedAt }
const priceCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

export const getQuotes = async (symbols) => {
  const now = Date.now();
  const symbolsToFetch = [];
  const results = [];

  // 1. Check Cache
  for (const sym of symbols) {
    const cached = priceCache.get(sym);
    if (cached && (now - cached.fetchedAt < CACHE_TTL_MS)) {
      results.push({ ...cached, symbol: sym, fromCache: true });
    } else {
      symbolsToFetch.push(sym);
    }
  }

  // 2. Fetch Uncached
  if (symbolsToFetch.length > 0) {
    try {
      const quotes = await yahooFinance.quote(symbolsToFetch);
      // Ensure quotes is an array (single symbol returns an object)
      const quoteArray = Array.isArray(quotes) ? quotes : [quotes];

      for (const quote of quoteArray) {
        if (!quote) continue;
        
        const dataToCache = {
          regularMarketPrice: quote.regularMarketPrice || null,
          regularMarketChangePercent: quote.regularMarketChangePercent || 0,
          fetchedAt: now,
        };
        
        priceCache.set(quote.symbol, dataToCache);
        results.push({ ...dataToCache, symbol: quote.symbol, fromCache: false });
      }
    } catch (err) {
      console.error(`[yahooPriceService] API fetch failed for ${symbolsToFetch.join(', ')}:`, err.message);
      
      // 3. Fallback to stale cache if 429 occurs
      for (const sym of symbolsToFetch) {
        const cached = priceCache.get(sym);
        if (cached) {
          console.log(`[yahooPriceService] Falling back to stale cache for ${sym}`);
          results.push({ ...cached, symbol: sym, fromCache: true, isStale: true });
        }
      }
    }
  }

  return results;
};

export const getQuote = async (symbol) => {
  const results = await getQuotes([symbol]);
  return results.find(r => r.symbol === symbol) || null;
};
