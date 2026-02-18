import cron from "node-cron";
import foodModel from "../models/foodModel.js";

// 8:00 PM daily
cron.schedule("0 20 * * *", async () => {
  console.log("🔥 CRON TRIGGERED AT", new Date().toLocaleTimeString());

  await foodModel.updateMany(
    { dailySalesCount: { $lt: 5 } },
    {
      $set: {
        flashSale: true,
        discountPercentage: 30
      }
    }
  );
});

// Reset at midnight
cron.schedule("0 0 * * *", async () => {
  await foodModel.updateMany({}, {
    $set: {
      dailySalesCount: 0,
      flashSale: false,
      discountPercentage: 0
    }
  });
});

