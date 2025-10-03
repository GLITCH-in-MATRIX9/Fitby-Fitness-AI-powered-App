const OpenAI = require("openai");
const openai = new OpenAI({
    // It assumes your key is in the .env file as GEMINI_API_KEY
    apiKey: process.env.GEMINI_API_KEY, 
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai" 
});

exports.generateDietPlanTask = async (req, res) => {
    try {
        const { age, gender, weight, fitnessGoal, preferences } = req.body;

        const prompt = `
            You are an expert Indian nutritionist. Create a comprehensive 7-day Indian diet plan.
            
            User Details:
            Age: ${age}
            Gender: ${gender}
            Weight: ${weight} kg
            Fitness Goal: ${fitnessGoal}
            Preferences/Allergies: ${preferences || 'None'}

            Rules:
            1. The plan must include 7 days of meals (Early Morning, Breakfast, Mid-Morning, Lunch, Evening Snack, Dinner, Post Dinner).
            2. Estimated daily calories should target the weight gain goal (likely 2200+ kcal).
            3. Format the entire output STRICTLY as a single JSON object. DO NOT include any text, greetings, or explanations outside the JSON block.

            Format the output ONLY in JSON with the following structure:
            {
              "status": "Success",
              "planName": "Personalized 7-Day Indian Diet Plan",
              "dailyCalories": "Estimated target calories for this goal (e.g., 2300 kcal)",
              "planDetails": [
                {
                  "day": "Day 1",
                  "meals": [
                    {"time": "Early Morning", "item": "...", "calories": "..."},
                    // ... continue for all 7 meals ...
                  ]
                },
                // ... continue through Day 7 ...
              ]
            }
        `;

        const completion = await openai.chat.completions.create({
            // Use the recommended free-tier-friendly Gemini model
            model: "gemini-2.5-flash", 
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7, // Good for creative generation
        });

        const rawContent = completion.choices[0].message.content.trim();
        let plan;

        // --- FIX 2: Strip Markdown Code Fences (```json) for successful JSON.parse() ---
        let jsonString = rawContent;
        if (rawContent.startsWith('```')) {
            // This regex removes the starting '```json' and the closing '```'
            jsonString = rawContent.replace(/^```json\s*|```\s*$/g, '').trim();
        }
        
        try {
            plan = JSON.parse(jsonString);
        } catch (e) {
            // Fallback for non-JSON or unfixable response
            console.error("Final JSON parsing failed:", e.message);
            plan = { status: "FAILED", error: "AI response was not valid JSON.", raw_response: rawContent };
        }

        // Return the structured output required by Orkes Conductor
        res.json({
            outputData: plan,
            status: "COMPLETED"
        });

    } catch (err) {
        console.error("Workflow Execution Error:", err);
        // Ensure a 500 status is sent to Orkes to signal a task failure
        res.status(500).json({ 
            status: "FAILED", 
            error: "Backend processing error: " + err.message 
        });
    }
};