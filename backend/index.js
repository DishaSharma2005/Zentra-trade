import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.FRONTEND_URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/holdings", holdingRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/indices", indicesRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
