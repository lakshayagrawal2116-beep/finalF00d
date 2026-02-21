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

// Run this check immediately when server starts to catch up if it was offline at 8 PM
const checkMissedFlashSale = async () => {
  const nowStr = new Date().toLocaleString("en-US", { timeZone: TIMEZONE });
  const nowInIST = new Date(nowStr);
  const currentHour = nowInIST.getHours();

  // If local time is between 20:00 (8 PM) and 00:00 (Midnight)
  if (currentHour >= 20 && currentHour <= 23) {
    console.log(`⏰ Server started during Flash Sale window (IST hour: ${currentHour}). Initializing Flash Sale...`);
    await activateFlashSale();
  }
};

checkMissedFlashSale();
