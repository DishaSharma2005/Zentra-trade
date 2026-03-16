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

// --- Rate Limiting ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down." },
});

app.use(globalLimiter);

// --- CORS ---
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://zentra-trade.vercel.app",
      process.env.FRONTEND_URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
