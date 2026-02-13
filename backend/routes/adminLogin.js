import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"

const router = express.Router()

// POST /api/admin/login
router.post("/login", async (req, res) => {
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
})

export default router
