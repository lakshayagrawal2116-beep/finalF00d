import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { generateSalesInsights } from "../controllers/adminAIController.js";
import { generateSalesFollowUp } from "../controllers/adminAIController.js";
const router = express.Router();

router.get("/ai-sales-insights", adminAuth, generateSalesInsights);
router.post(
  "/ai-sales-followup",
  adminAuth,
  generateSalesFollowUp
);

export default router;
