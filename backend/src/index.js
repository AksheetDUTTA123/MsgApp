import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/auth.route.js";
import User from "./models/user.model.js"; 
import {connectDB} from "./lib/db.js";
const PORT = process.env.PORT;
const app = express();

app.use("/api/auth", authRoutes)
app.listen(PORT, async () =>  {
    console.log("server running on port " +  PORT);
    connectDB();
    const user = new User({
        email: "aksheetd@umich.edu",
        password: "fakework",
      });
    await user.save();
});