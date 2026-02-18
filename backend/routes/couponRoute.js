import express from "express"
import authMiddleware from "../middleware/auth.js";
import userModel from "../models/userModel.js";
import Coupon from "../models/coupon.js"
const router = express.Router();

router.post("/coupon/create", async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json({ success: true, coupon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ADMIN: list all coupons
router.get("/coupon/list", async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching coupons" });
  }
});

// USER: list active & valid coupons
// USER: list active & valid coupons
router.get("/coupon/active", async (req, res) => {
  try {
    const coupons = await Coupon.find({
      active: true,
      expiryDate: { $gte: new Date() }
    }).select(
      "code discountType discountValue minOrderAmount expiryDate"
    );

    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching coupons"
    });
  }
});



router.post("/coupon/apply", authMiddleware, async (req, res) => {
  const { code, cartTotal } = req.body;
  const userId = req.user.id;

  const coupon = await Coupon.findOne({ code });

  if (!coupon || !coupon.active)
    return res.status(400).json({ message: "Invalid coupon" });

  if (coupon.expiryDate < new Date())
    return res.status(400).json({ message: "Coupon expired" });

  if (coupon.usedCount >= coupon.usageLimit)
    return res.status(400).json({ message: "Coupon limit reached" });

  if (cartTotal < coupon.minOrderAmount)
    return res.status(400).json({
      message: `Minimum order ₹${coupon.minOrderAmount}`
    });

  const user = await userModel.findById(userId);
  if (user.usedCoupons.includes(code))
    return res.status(400).json({ message: "Coupon already used" });

  let discount =
    coupon.discountType === "flat"
      ? coupon.discountValue
      : (cartTotal * coupon.discountValue) / 100;

  res.json({ discount });
});

export default router;


