import express from "express";
import { recommendFood } from "../controllers/food.js";

const router = express.Router();

router.post("/recommend", recommendFood);

export default router;
