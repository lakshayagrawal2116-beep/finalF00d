import express from "express";
import cors from "cors"
import connectDB from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import couponRoute from "./routes/couponRoute.js";
import foodRoutes from "./routes/recommendRoute.js"
import adminRoute from "./routes/adminRoute.js"
import path from "path";
import "./cron/flashSaleJob.js";


import adminRoutes from "./aiServer/routes/adminRoutes.js"
//app config
const app = express();
const PORT = process.env.PORT || 4000;


// middleware
app.use(express.json());
app.use(cors());
console.log("Server Time:", new Date().toString());


//db connection
connectDB();
app.get("/", (req, res) => {
    res.send("API WORKING")

})

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api", couponRoute);
app.use("/api/food", foodRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/admin2", adminRoutes);
app.get("/ping", (req, res) => {
    res.status(200).send("pong");
})
// const __dirname = path.resolve();

// // Serve frontend static files
// app.use(express.static(path.join(__dirname, "frontend/dist")));

// // SPA fallback for React Router
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
// })





app.listen(PORT, () => {
    console.log(`server started on http://localhost:${PORT}`);
})

/* 🔁 SELF-PING TO KEEP SERVER ALIVE ON RENDER */
const SERVER_URL = "https://taste-runners1.onrender.com"; // Replace with your actual Render URL if different

const keepAlive = () => {
    fetch(`${SERVER_URL}/ping`)
        .then(() => console.log(`🏓 Self-Ping Successful: ${new Date().toISOString()}`))
        .catch((err) => console.error("❌ Self-Ping Failed:", err.message));
};

// Ping every 14 minutes (Render sleeps after 15 mins)
setInterval(keepAlive, 14 * 60 * 1000);

//mongodb+srv://<db_username>:<db_password>@cluster0.qiphosx.mongodb.net/?appName=Cluster0