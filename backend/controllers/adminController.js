import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const range = Number(req.query.range || 7);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range);

    // ✅ ONLY PAID ORDERS
    const orders = await Order.find({
      createdAt: { $gte: startDate },
      payment: true
    });

    let totalRevenue = 0;
    let todayRevenue = 0;
    const salesByDate = {};

    const today = new Date().toISOString().split("T")[0];

    orders.forEach(order => {
      const amount = Number(order.amount || 0);
      if (amount <= 0) return;

      totalRevenue += amount;

      const date = order.createdAt.toISOString().split("T")[0];

      if (date === today) {
        todayRevenue += amount;
      }

      salesByDate[date] = (salesByDate[date] || 0) + amount;
    });

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
      stats: {
        totalRevenue,
        todayRevenue,
        totalOrders,
        totalUsers,
        salesByDate
      }
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Dashboard error" });
  }
};
