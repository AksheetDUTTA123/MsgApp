import express from "express";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use("/api/auth", authRoutes)
app.listen(5173, () => {
    console.log("server running on port 5173");
});