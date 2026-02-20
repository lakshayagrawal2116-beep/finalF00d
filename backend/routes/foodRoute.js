import express from "express";
import { addFood, listFood, removeFood, triggerFlashSale, resetFlashSale } from "../controllers/foodController.js";
import multer from "multer";
import foodModel from "../models/foodModel.js";
const foodRouter = express.Router();

//Image storage Engine

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`)

  }
})

const uploads = multer({ storage: storage })
foodRouter.post("/add", uploads.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.get("/flash-sale", async (req, res) => {
  const items = await foodModel.find({ flashSale: true });
  res.json({ success: true, data: items });
});

// 🔥 New Testing Routes
foodRouter.post("/flash-sale/trigger", triggerFlashSale);
foodRouter.post("/flash-sale/reset", resetFlashSale);

foodRouter.post("/remove", removeFood);

export default foodRouter;