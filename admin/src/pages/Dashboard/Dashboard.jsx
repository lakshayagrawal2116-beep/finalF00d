import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = ({ url }) => {
  const [data, setData] = useState(null);
  const [range, setRange] = useState("7");

  useEffect(() => {

    const token = localStorage.getItem("adminToken");
    
    axios
      .get(`${url}/api/admin/dashboard?range=${range}`,{
        headers: {
      Authorization: `Bearer ${token}`,
    },
      })
      .then(res => setData(res.data.stats))
      .catch(err => console.error(err));
  }, [range, url]);

  if (!data) return <p>Loading dashboard...</p>;

  // ✅ SAFE chart data
  const chartData = data.salesByDate
    ? Object.entries(data.salesByDate).map(([date, revenue]) => ({
        date,
        revenue
      }))
    : [];

  return (
    <div className="admin-dashboard">
      <h2>📊 Admin Dashboard</h2>

      <div className="stats-grid">
        <StatCard title="Total Revenue" value={`₹${data.totalRevenue}`} />
        <StatCard title="Orders" value={data.totalOrders} />
        <StatCard title="Users" value={data.totalUsers} />
        <StatCard title="Today's Revenue" value={`₹${data.todayRevenue}`} />
      </div>

      <div className="dashboard-filter">
        <button
          className={range === "7" ? "active" : ""}
          onClick={() => setRange("7")}
        >
          Last 7 Days
        </button>
        <button
          className={range === "30" ? "active" : ""}
          onClick={() => setRange("30")}
        >
          Last 30 Days
        </button>
      </div>

      <div className="chart-wrapper">
        {chartData.length === 0 ? (
          <p className="empty-chart">No sales data available</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#ff4d4d"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

export default Dashboard;
