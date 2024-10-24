import "dotenv/config";
import express from "express";
import cors from "cors";
import dbConnection from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

dbConnection(); // Connect to MongoDB database

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://delievery-app-topaz.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(cookieParser());

app.get("/api", (req, res) => {
  res.json({ message: "API is working fine!" });
});
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", cartRoutes);
app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
