import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ordersRoutes from "./routes/orders.js";
import holdingRoutes from "./routes/holding.js";
import userRoutes from "./routes/user.js";
import portfolioRoutes from "./routes/portfolio.js";
import transactionsRoutes from "./routes/transactions.js";
import watchlistRoutes from "./routes/watchlist.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/holdings", holdingRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/watchlist", watchlistRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
