import cron from "node-cron";
import foodModel from "../models/foodModel.js";

const TIMEZONE = "Asia/Kolkata";

const activateFlashSale = async () => {
  console.log("🔥 STARTING FLASH SALE FOR LOW SELLING ITEMS");

  const now = new Date();
  // Calculate exact Midnight IST safely across environments
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffsetMs);
  istTime.setUTCHours(24, 0, 0, 0);
  const saleEndsAt = new Date(istTime.getTime() - istOffsetMs);

  // Find items with less than 5 sales today and not already on flash sale
  await foodModel.updateMany(
    { dailySalesCount: { $lt: 5 }, flashSale: false },
    {
      $set: {
        flashSale: true,
        discountPercentage: 30,
        flashSaleStartsAt: now,
        flashSaleEndsAt: saleEndsAt
      }
    }
  );
};

// 8:00 PM daily - Start Flash Sale for items with low sales
cron.schedule("0 20 * * *", activateFlashSale, {
  timezone: TIMEZONE
});


// 🌙 Reset at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("🌙 Flash Sale Reset", new Date().toLocaleString());

  await foodModel.updateMany(
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
}, {
  timezone: TIMEZONE
});

// Reset any expired/stale flash sales (e.g. server slept through midnight)
const resetStaleSales = async () => {
  const now = new Date();
  const result = await foodModel.updateMany(
    { flashSale: true, flashSaleEndsAt: { $lt: now } },
    {
      $set: {
        flashSale: false,
        discountPercentage: 0,
        flashSaleStartsAt: null,
        flashSaleEndsAt: null,
        dailySalesCount: 0
      }
    }
  );
  if (result.modifiedCount > 0) {
    console.log(`🧹 Cleaned up ${result.modifiedCount} expired flash sale items`);
  }
};

// Run this check immediately when server starts to catch up if it was offline
const checkMissedFlashSale = async () => {
  // Step 1: Always clean up stale/expired sales first
  await resetStaleSales();

  // Step 2: If within sale window (8 PM - Midnight IST), activate fresh sales
  const nowStr = new Date().toLocaleString("en-US", { timeZone: TIMEZONE });
  const nowInIST = new Date(nowStr);
  const currentHour = nowInIST.getHours();

  if (currentHour >= 20 && currentHour <= 23) {
    console.log(`⏰ Server started during Flash Sale window (IST hour: ${currentHour}). Initializing Flash Sale...`);
    await activateFlashSale();
  }
};

checkMissedFlashSale();
