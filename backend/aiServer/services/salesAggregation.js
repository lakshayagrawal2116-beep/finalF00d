import orderModel from "../../models/orderModel.js";

export async function getSalesStats(range) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(range));

  const stats = await orderModel.aggregate([
    {
      $match: {
        payment: true,
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
        totalOrders: { $sum: 1 },
        avgOrderValue: { $avg: "$amount" },
      },
    },
  ]);

  return stats[0] || {
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
  };
}
