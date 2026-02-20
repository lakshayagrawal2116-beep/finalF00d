import cron from "node-cron";
import foodModel from "../models/foodModel.js";

// 8:00 PM daily - Start Flash Sale for items with low sales
cron.schedule("0 20 * * *", async () => {
  console.log("🔥 STARTING FLASH SALE FOR LOW SELLING ITEMS");

  const now = new Date();
  const saleEndsAt = new Date();
  saleEndsAt.setHours(24, 0, 0, 0); // Midnight

  // Find items with less than 5 sales today
  await foodModel.updateMany(
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
});
