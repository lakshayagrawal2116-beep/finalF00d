import jwt from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import coupon from "../models/coupon.js";
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

    // 1️⃣ Calculate items total FIRST
    const itemsTotal = req.body.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    let appliedCoupon = null;
    let safeDiscount = 0;

    // 2️⃣ Validate coupon in backend (DO NOT trust frontend)
    if (req.body.couponCode) {
      const couponDoc = await coupon.findOne({
        code: req.body.couponCode,
        active: true
      });

      if (!couponDoc) {
        return res.status(400).json({ message: "Invalid coupon" });
      }

      if (couponDoc.expiryDate < new Date()) {
        return res.status(400).json({ message: "Coupon expired" });
      }

      if (itemsTotal < couponDoc.minOrderAmount) {
        return res.status(400).json({ message: "Minimum order not met" });
      }

      safeDiscount =
        couponDoc.discountType === "flat"
          ? couponDoc.discountValue
          : (itemsTotal * couponDoc.discountValue) / 100;

      appliedCoupon = couponDoc.code;
    }

    // 3️⃣ Final amount
    const finalAmount = itemsTotal + DELIVERY_FEE - safeDiscount;

    // 4️⃣ Save order
    const newOrder = new orderModel({
      userId: decoded.id,
      items: req.body.items,
      amount: finalAmount,
      address: req.body.address,
      couponCode: appliedCoupon,
      discountAmount: safeDiscount,
      payment: false,
    });

    await newOrder.save();

    // 5️⃣ Stripe line items
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: DELIVERY_FEE * 100,
      },
      quantity: 1,
    });

    // 6️⃣ Stripe discount
    let discounts = [];

    if (safeDiscount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: safeDiscount * 100,
        currency: "inr",
        duration: "once",
        name: appliedCoupon || "Discount",
      });

      discounts.push({ coupon: stripeCoupon.id });
    }

    // 7️⃣ Create session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      discounts,
      success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    res.status(500).json({ success: false, message: "Order placement failed" });
  }
};


const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // ❌ Payment failed → delete order
    if (success !== "true") {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment failed" });
    }
    // ✅ Update Daily Sales Count for items in order
    for (const item of order.items) {
      await foodModel.findByIdAndUpdate(
        item._id,
        { $inc: { dailySalesCount: item.quantity } }
      );
    }

    // ✅ Increment coupon ONLY ONCE
    if (order.couponCode && !order.couponUsed) {
      await coupon.findOneAndUpdate(
        { code: order.couponCode },
        { $inc: { usedCount: 1 } }
      );

      order.couponUsed = true;
    }

    // ✅ Mark payment success (idempotent)
    order.payment = true;
    await order.save();

    return res.json({
      success: true,
      message: "Payment successful",
    });

  } catch (error) {
    console.error("VERIFY ORDER ERROR:", error);
    return res.json({
      success: false,
      message: "Error verifying payment",
    });



  }
};



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

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
    res.json({ success: true, data: orders })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })

  }

}
// api for updating order status 
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status updated" })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" })

  }

}


export { verifyOrder, placeOrder, userOrders, listOrders, updateStatus };
