import jwt from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const DELIVERY_FEE = 50;
const FRONTEND_URL = "https://taste-runners1.onrender.com"; // use env later

const placeOrder = async (req, res) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!req.body.items || req.body.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const itemsTotal = req.body.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const finalAmount = itemsTotal + DELIVERY_FEE;

        const newOrder = new orderModel({
            userId: decoded.id,
            items: req.body.items,
            amount: finalAmount,
            address: req.body.address,
            payment:false
        });

        await newOrder.save();

        const line_items = req.body.items.map(item => ({
            price_data: {
                currency: "inr",
                product_data: { name: item.name },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: { name: "Delivery Charges" },
                unit_amount: DELIVERY_FEE * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Order placement failed" });
    }
};

const verifyOrder=async(req,res)=>{
    const {orderId,success} =req.body;
    try{
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})

    }

}

//user orders for frontend
const userOrders = async (req, res) => {
    try {
        console.log("USER IN CONTROLLER:", req.user);

        const orders = await orderModel.find({
            userId: req.user.id
        });

        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
};


// Listing order for admin panel

const listOrders=async(req,res)=>{
    try{
        const orders=await orderModel.find({})
        res.json({success:true,data:orders})

    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})

    }

}
// api for updating order status 
const updateStatus=async(req,res)=>{
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status updated"})

    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})

    }

}


export {verifyOrder, placeOrder,userOrders,listOrders,updateStatus };
