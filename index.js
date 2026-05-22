import express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.js";
import categoryRoutes from "./src/routes/admin/category.route.js";
import productRoutes from "./src/routes/admin/product.route.js";
import {protect , restrictTo} from "./src/middlewares/auth.middleware.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT | 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin/categories", protect, restrictTo("ADMIN"), categoryRoutes);
app.use("/api/admin/product", protect, restrictTo("ADMIN"), productRoutes);
// app.use("/api/seller", protect, restrictTo("SELLER"), sellerRoutes);
// app.use("/api/user", protect, userRoutes);

app.get("/", (req, res)=>{
    res.send("Shop flow app is running");
});

app.listen(PORT, ()=>{
    console.log(`App is running on port ${PORT}`);
});