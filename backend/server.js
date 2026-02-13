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



//app config
const app=express();
const PORT=process.env.PORT || 4000;


// middleware
app.use(express.json());
app.use(cors());

//db connection
connectDB();
app.get("/",(req,res)=>{
    res.send("API WORKING")

})

// api endpoints
app.use("/api/food",foodRouter);
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);
app.use("/api", couponRoute);
app.use("/api/food", foodRoutes);
app.use("/api/admin",adminRoute)




app.listen(PORT,()=>{
    console.log(`server started on http://localhost:${PORT}`);
})

//mongodb+srv://<db_username>:<db_password>@cluster0.qiphosx.mongodb.net/?appName=Cluster0