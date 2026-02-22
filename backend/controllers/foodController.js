import foodModel from "../models/foodModel.js";
import orderModel from "../models/orderModel.js";

import fs from 'fs';

//add food item
const addFood = async (req, res) => {
    try {
        // 🔍 Debug (keep for now)
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required"
            });
        }

        const image_filename = req.file.filename;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
            mode: req.body.mode
        });

        await food.save();
        res.json({ success: true, message: "Food Added" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" })
    }

}
//remove food item
const removeFood = async (req, res) => {

    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { })

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "food removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }

}

// Add rating for a food item
const addRating = async (req, res) => {
    try {
        const { orderId, foodId, rating } = req.body;
        const userId = req.user._id || req.user.id; // From authMiddleware

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }

        // Find the specific order to persist the rating there
        const order = await orderModel.findOne({ _id: orderId, userId, status: "Delivered" });
        if (!order) {
            return res.status(403).json({ success: false, message: "Valid delivered order not found." });
        }

        let itemFound = false;
        order.items = order.items.map(item => {
            if (String(item._id) === String(foodId)) {
                item.rating = rating;
                itemFound = true;
            }
            return item;
        });

        if (!itemFound) {
            return res.status(404).json({ success: false, message: "Food item not found in this order." });
        }

        order.markModified('items');
        await order.save();

        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        const existingRatingIndex = food.ratings.findIndex(r => String(r.userId) === String(userId));
        if (existingRatingIndex !== -1) {
            food.ratings[existingRatingIndex].rating = rating;
        } else {
            food.ratings.push({ userId, rating });
        }

        const totalRatings = food.ratings.reduce((sum, r) => sum + r.rating, 0);
        food.averageRating = food.ratings.length > 0 ? (totalRatings / food.ratings.length).toFixed(1) : 0;

        await food.save();
        res.json({ success: true, message: "Rating submitted successfully", averageRating: food.averageRating });

    } catch (error) {
        console.error("Add Rating Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { addFood, listFood, removeFood, addRating };

// 🔥 TRIGGER FLASH SALE (For Testing/Manual Start)
export const triggerFlashSale = async (req, res) => {
    try {
        console.log("🔥 MANUALLY TRIGGERING FLASH SALE");
        const now = new Date();

        // Calculate exact Midnight IST safely across environments
        const istOffsetMs = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(now.getTime() + istOffsetMs);
        istTime.setUTCHours(24, 0, 0, 0);
        const saleEndsAt = new Date(istTime.getTime() - istOffsetMs);

        const result = await foodModel.updateMany(
            { dailySalesCount: { $lt: 5 } },
            {
                $set: {
                    flashSale: true,
                    discountPercentage: 30,
                    flashSaleStartsAt: now,
                    flashSaleEndsAt: saleEndsAt
                }
            }
        );

        res.json({
            success: true,
            message: "Flash sale triggered",
            matched: result.matchedCount,
            modified: result.modifiedCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error triggering flash sale" });
    }
};

// 🌙 RESET FLASH SALE (Clean DB)
export const resetFlashSale = async (req, res) => {
    try {
        console.log("🌙 MANUALLY RESETTING FLASH SALE");
        const result = await foodModel.updateMany(
            {},
            {
                $set: {
                    dailySalesCount: 0,
                    flashSale: false,
                    discountPercentage: 0,
                    flashSaleStartsAt: null,
                    flashSaleEndsAt: null
                }
            }
        );

        res.json({
            success: true,
            message: "Flash sale reset",
            matched: result.matchedCount,
            modified: result.modifiedCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error resetting flash sale" });
    }
};