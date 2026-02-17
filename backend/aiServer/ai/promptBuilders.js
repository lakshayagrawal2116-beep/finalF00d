export const buildSalesInsightPrompt = (stats, range) => `
You are a senior food-delivery business analyst.

Sales performance for the last ${range} days:

{
  "totalRevenue": ${stats.totalRevenue},
  "totalOrders": ${stats.totalOrders},
  "averageOrderValue": ${Math.round(stats.avgOrderValue)}
}

Return ONLY valid JSON.
No markdown.
No explanation.

{
  "summary": "short business summary",
  "trend": "increasing | decreasing | stable",
  "possible_reasons": ["reason 1", "reason 2"],
  "recommendations": ["action 1", "action 2"]
}
`;
