import OpenAI from "openai";

// Gemini OpenAI-compatible client
const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

/* ---------------- HELPER: Safe JSON Extractor ---------------- */

function extractJSON(text) {
  try {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) return null;

    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

/* ---------------- CONTROLLER ---------------- */

export const recommendFood = async (req, res) => {
  try {
    const {
      veg_non,
      spicy = "any",
      category,
      health = "any",
      count = 5
    } = req.body;

    // Basic validation
    if (!veg_non || !category) {
      return res.status(400).json({
        success: false,
        message: "veg_non and category are required"
      });
    }

    /* ---------------- PROMPT ---------------- */

    const prompt = `
Suggest ${count} ${veg_non} food items.

Category: ${category}
Spice: ${spicy}
Health: ${health}

Return ONLY valid JSON in this format:

{
  "recommendations": [
    {
      "name": "",
      "category": "",
      "veg_non": "",
      "spice_level": "",
      "reason": ""
    }
  ]
}

JSON format:
{
  "recommendations": [
    {
      "name": "Food name",
      "category": "Category",
      "veg_non": "veg | non-veg",
      "spice_level": "low | medium | high",
      "reason": "Short reason"
    }
  ]
}
`;

    /* ---------------- FIRST AI CALL ---------------- */

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 2000
    });

    const raw = response.choices[0]?.message?.content || "";

    // DEBUG (keep during development)
    console.log("RAW AI RESPONSE:\n", raw);

    if (!raw.includes("]}")) {
  console.warn("⚠️ AI response truncated");
}


    let data = extractJSON(raw);

    /* ---------------- RETRY ONCE IF INVALID ---------------- */

    if (!data) {
      const retryPrompt = `
Return ONLY valid JSON.
No markdown.
No explanation.
No text outside JSON.

${prompt}
`;

      const retry = await AI.chat.completions.create({
        model: "gemini-3-flash-preview",
        messages: [{ role: "user", content: retryPrompt }],
        temperature: 0.2,
        max_tokens: 800
      });

      const retryRaw = retry.choices[0]?.message?.content || "";
      console.log("RETRY AI RESPONSE:\n", retryRaw);

      data = extractJSON(retryRaw);
    }

    /* ---------------- FINAL VALIDATION ---------------- */

    if (!data || !Array.isArray(data.recommendations)) {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid structured response"
      });
    }

    /* ---------------- SUCCESS ---------------- */

    return res.json({
      success: true,
      recommendations: data.recommendations
    });

  } catch (error) {
    console.error("Food recommendation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate recommendations"
    });
  }
};
