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

  // 🤖 AI Insight states
  const [aiInsight, setAiInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // 🤖 Follow-up states
  const [question, setQuestion] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [followUpLoading, setFollowUpLoading] = useState(false);

  /* ---------------- DASHBOARD DATA ONLY ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    axios
      .get(`${url}/api/admin/dashboard?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data.stats))
      .catch((err) => console.error(err));
  }, [range, url]);

  if (!data) return <p>Loading dashboard...</p>;

  /* ---------------- SAFE CHART DATA ---------------- */
  const chartData = data.salesByDate
    ? Object.entries(data.salesByDate).map(([date, revenue]) => ({
        date,
        revenue,
      }))
    : [];

  /* ---------------- GENERATE AI INSIGHTS (MANUAL) ---------------- */
  const fetchAiInsights = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      setAiLoading(true);
      setAiInsight(null);

      const res = await axios.get(
        `${url}/api/admin2/ai-sales-insights?range=${range}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) {
        setAiInsight(res.data.insight);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  /* ---------------- ASK FOLLOW-UP ---------------- */
  const askFollowUp = async () => {
    if (!question.trim()) return;

    const token = localStorage.getItem("adminToken");

    try {
      setFollowUpLoading(true);
      setFollowUpAnswer("");

      const res = await axios.post(
        `${url}/api/admin2/ai-sales-followup`,
        { question, range },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setFollowUpAnswer(res.data.answer);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFollowUpLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>📊 Admin Dashboard</h2>

      {/* STATS */}
      <div className="stats-grid">
        <StatCard title="Total Revenue" value={`₹${data.totalRevenue}`} />
        <StatCard title="Orders" value={data.totalOrders} />
        <StatCard title="Users" value={data.totalUsers} />
        <StatCard title="Today's Revenue" value={`₹${data.todayRevenue}`} />
      </div>

      {/* RANGE FILTER */}
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

      {/* CHART */}
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

      {/* 🤖 AI SALES INSIGHTS */}
      <div className="ai-insight-card">
        <div className="ai-header">
          <h3>🤖 AI Sales Insights</h3>
          <button
            className="ai-generate-btn"
            onClick={fetchAiInsights}
            disabled={aiLoading}
          >
            {aiLoading ? "Analyzing..." : "Generate Insights"}
          </button>
        </div>

        {aiInsight ? (
          <>
            <p className="ai-summary">{aiInsight.summary}</p>

            <p className={`ai-trend ${aiInsight.trend}`}>
              📈 Trend: <strong>{aiInsight.trend.toUpperCase()}</strong>
            </p>

            <ul className="ai-recommendations">
              {aiInsight.recommendations.map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="ai-empty">
            Click <strong>Generate Insights</strong> to analyze sales using AI.
          </p>
        )}
      </div>

      {/* 🤖 FOLLOW-UP */}
      {aiInsight && (
        <div className="ai-followup-card">
          <h3>🤖 Ask AI a Follow-up</h3>

          <textarea
            placeholder="Ask about sales, growth, marketing, customers..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button onClick={askFollowUp} disabled={followUpLoading}>
            {followUpLoading ? "Thinking..." : "Ask AI"}
          </button>

          {followUpAnswer && (
            <div className="ai-followup-answer">
              <strong>AI Answer:</strong>
              <p>{followUpAnswer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------------- STAT CARD ---------------- */
const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

export default Dashboard;
