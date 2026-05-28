import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

// Cache map: symbol -> { regularMarketPrice, regularMarketChangePercent, regularMarketPreviousClose, fetchedAt }
const priceCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

// Baseline prices for simulated/mock feed when Yahoo Finance is blocked on deployed servers
const BASELINE_PRICES = {
  "INFY.NS": { price: 1560.50, change: -0.45 },
  "ONGC.NS": { price: 282.30, change: 1.25 },
  "TCS.NS": { price: 3845.00, change: 0.65 },
  "KPITTECH.NS": { price: 1422.40, change: 2.15 },
  "QUICKHEAL.NS": { price: 478.90, change: -1.45 },
  "WIPRO.NS": { price: 462.15, change: 0.12 },
  "RELIANCE.NS": { price: 2455.00, change: -0.75 },
  "HINDUNILVR.NS": { price: 2362.40, change: 0.35 },
  "HUL.NS": { price: 2362.40, change: 0.35 },
  "^NSEI": { price: 22415.80, change: 0.28 },
  "^BSESN": { price: 73820.50, change: 0.24 }
};

// Generates slightly fluctuating prices based on the current timestamp to simulate live movement
const getSimulatedPrice = (symbol) => {
  const base = BASELINE_PRICES[symbol] || { price: 150.00, change: 0.00 };
  
  // Fluctuate price slightly using a deterministic random walk based on the current time block
  // to make it look active but consistent across requests.
  const timeSec = Math.floor(Date.now() / 5000); // changes every 5 seconds
  const hash = (timeSec ^ symbol.charCodeAt(0) ^ symbol.charCodeAt(symbol.length - 1)) % 100;
  const variationPercent = (hash - 50) / 1500; // range: ~ -0.03% to +0.03%
  
  const currentPrice = base.price * (1 + variationPercent);
  const currentChange = base.change + (variationPercent * 100);
  const previousClose = currentPrice / (1 + (currentChange / 100));
  
  return {
    regularMarketPrice: Number(currentPrice.toFixed(2)),
    regularMarketChangePercent: Number(currentChange.toFixed(2)),
    regularMarketPreviousClose: Number(previousClose.toFixed(2)),
    fetchedAt: Date.now(),
    isSimulated: true
  };
};

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
          regularMarketPreviousClose: quote.regularMarketPreviousClose || null,
          fetchedAt: now,
        };
        
        priceCache.set(quote.symbol, dataToCache);
        results.push({ ...dataToCache, symbol: quote.symbol, fromCache: false });
      }
    } catch (err) {
      console.warn(`[yahooPriceService] API fetch failed for ${symbolsToFetch.join(', ')}. Details: ${err.message}. Using simulated price feed as fallback.`);
      
      // Fallback: Populate results with simulated prices or stale cache for the uncached symbols
      for (const sym of symbolsToFetch) {
        const cached = priceCache.get(sym);
        if (cached) {
          console.log(`[yahooPriceService] Falling back to stale cache for ${sym}`);
          results.push({ ...cached, symbol: sym, fromCache: true, isStale: true });
        } else {
          const simulated = getSimulatedPrice(sym);
          priceCache.set(sym, simulated); // cache the simulated price
          results.push({ ...simulated, symbol: sym, fromCache: false, isFallback: true });
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
