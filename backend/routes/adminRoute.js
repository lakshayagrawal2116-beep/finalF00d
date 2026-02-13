import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
import { getDashboardStats } from "../controllers/adminController.js"
import adminAuth from "../middleware/adminAuth.js"

const router = express.Router()

// ✅ ADMIN LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await userModel.findOne({ email, role: "admin" })
    if (!admin)
      return res.status(401).json({ message: "Not authorized" })

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch)
      return res.status(401).json({ message: "Wrong password" })

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({ token })
  } catch (err) {
    res.status(500).json({ message: "Login error" })
  }
})

// 🔒 ADMIN DASHBOARD
router.get("/dashboard", adminAuth, getDashboardStats)

export default router
