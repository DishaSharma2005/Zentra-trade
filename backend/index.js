import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import ordersRoutes from "./routes/orders.js";
import holdingRoutes from "./routes/holding.js";
import userRoutes from "./routes/user.js";
import portfolioRoutes from "./routes/portfolio.js";
import transactionsRoutes from "./routes/transactions.js";
import watchlistRoutes from "./routes/watchlist.js";
import paymentsRoutes from "./routes/payments.js";
import chatRoutes from "./routes/chat.js";
import indicesRoutes from "./routes/indices.js";

dotenv.config();

const app = express();
// --- CORS ---
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://zentra-trade.vercel.app",
      process.env.FRONTEND_URL||""
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);
app.set("trust proxy", 1);

// --- Health Check (public, before rate limiter — for UptimeRobot / warmup pings) ---
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// --- Rate Limiting ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 500 requests per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down." },
  keyGenerator: (req) => {
    return req.ip; // correct IP after trust proxy
  },
});

if (process.env.NODE_ENV === "production") {
  app.use(globalLimiter);
}



app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);
app.use(express.json());

// --- Public Routes (no auth needed) ---
app.use("/api/indices", indicesRoutes);           // Live market data - public
app.use("/api/payments", paymentsRoutes);        // Webhook must be public; other routes do internal checks

// --- Protected Routes ---
app.use("/api/user", userRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/holdings", holdingRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/chat", chatRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
