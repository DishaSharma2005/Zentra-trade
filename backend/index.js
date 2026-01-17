import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ordersRoutes from "./routes/orders.js";

import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/orders", ordersRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
