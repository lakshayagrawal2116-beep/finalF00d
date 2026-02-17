import { geminiClient } from "../ai/geminiClient.js";
import { getSalesStats } from "../services/salesAggregation.js";
import { extractJSON } from "../utils/extractJSON.js";
import orderModel from "../../models/orderModel.js";

/* ================================
   AI SALES INSIGHTS (STRUCTURED)
================================ */

export const generateSalesInsights = async (req, res) => {
  try {
    const { range = 7 } = req.query;

    const stats = await getSalesStats(range);

    const prompt = `
You are a senior food-delivery business analyst.

Sales data for the last ${range} days:
{
  "totalRevenue": ${stats.totalRevenue},
  "totalOrders": ${stats.totalOrders},
  "averageOrderValue": ${Math.round(stats.avgOrderValue)}
}

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- No newlines inside strings
- Keep all string values SHORT

JSON FORMAT:
{
  "summary": "max 20 words",
  "trend": "increasing | decreasing | stable",
  "possible_reasons": ["short phrase", "short phrase"],
  "recommendations": ["short action", "short action"]
}
`;

    console.log("🔍 Calling Gemini Interactions API (Insights)...");

    const interaction = await geminiClient.interactions.create({
      model: "gemini-2.5-flash",
      input: prompt,
      generation_config: {
        temperature: 0.2,
        max_output_tokens: 300,
        thinking_level: "minimal",
      },
    });

    const rawText =
      interaction.outputs.find(o => o.type === "text")?.text || "";

    console.log("🧠 RAW GEMINI OUTPUT:\n", rawText);

    let insight = extractJSON(rawText);

    /* 🔁 Retry once if JSON breaks */
    if (!insight) {
      console.warn("⚠️ Invalid JSON, retrying...");

      const retry = await geminiClient.interactions.create({
        model: "gemini-2.5-flash",
        input: `Return ONLY valid JSON. ${prompt}`,
        generation_config: {
          temperature: 0.1,
          max_output_tokens: 300,
          thinking_level: "minimal",
        },
      });

      const retryText =
        retry.outputs.find(o => o.type === "text")?.text || "";

      insight = extractJSON(retryText);
    }

    if (!insight) {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON after retry",
      });
    }

    return res.json({
      success: true,
      stats,
      insight,
    });

  } catch (error) {
    console.error("❌ AI Sales Insight Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI sales insights",
    });
  }
};

/* ================================
   AI FOLLOW-UP (CHAT / Q&A)
================================ */

export const generateSalesFollowUp = async (req, res) => {
  try {
    const { question, range = 7 } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    /* -------- Aggregate sales data -------- */
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

    const data = stats[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
    };

    const prompt = `
You are an expert food-delivery business consultant.

Sales data (last ${range} days):
- Total Revenue: ₹${data.totalRevenue}
- Total Orders: ${data.totalOrders}
- Avg Order Value: ₹${Math.round(data.avgOrderValue)}

Admin Question:
"${question}"

RULES:
- Plain text only
- Short, actionable answer
- No markdown
- No emojis
`;

    console.log("🔍 Calling Gemini Interactions API (Follow-up)...");

    const interaction = await geminiClient.interactions.create({
      model: "gemini-2.5-flash",
      input: prompt,
      generation_config: {
        temperature: 0.4,
        max_output_tokens: 300,
        thinking_level: "low",
      },
    });

    const answer =
      interaction.outputs.find(o => o.type === "text")?.text || "";

    return res.json({
      success: true,
      answer,
    });

  } catch (error) {
    console.error("❌ AI Follow-up Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI follow-up response",
    });
  }
};
