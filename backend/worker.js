require('dotenv').config();

const { ConductorClient, TaskManager } = require("conductor-javascript");
const OpenAI = require("openai");

const config = {
    serverUrl: "https://play.orkes.io/api", 
    keyId: process.env.ORKES_KEY_ID, 
    keySecret: process.env.ORKES_KEY_SECRET,
};

console.log("--- DEBUG CONFIG ---");
console.log(`Server URL: ${config.serverUrl}`);

console.log(`Key ID: ${config.keyId ? 'LOADED' : 'MISSING'}`);
console.log(`Key Secret Length: ${config.keySecret ? config.keySecret.length : 'MISSING'}`);
console.log(`Gemini Key Length: ${process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 'MISSING'}`);
console.log("--------------------");


const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY, 
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    // Force a strict 20-second timeout for debugging stuck connections
    timeout: 20 * 1000, 
});


const generateDietPlanWorker = async (input) => {
    console.log("Processing diet plan for user:", input);

    const { age, gender, weight, fitnessGoal, preferences } = input;

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
    
    let rawContent;
    
    try {
        const completion = await openai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        rawContent = completion.choices[0].message.content.trim();
        
    } catch (apiError) {
        console.error("--- GEMINI API CALL FAILED ---");
        console.error("Error details:", apiError.message);
        console.error("------------------------------");
        throw new Error(`External API Failure: ${apiError.message}`);
    }


    let plan;

    let jsonString = rawContent;
    if (rawContent.startsWith('```')) {
        jsonString = rawContent.replace(/^```json\s*|```\s*$/g, '').trim();
    }

    try {
        plan = JSON.parse(jsonString);
    } catch (e) {
        console.error("Final JSON parsing failed:", e.message);
        throw new Error(`AI response was not valid JSON: ${rawContent}`);
    }
    
    console.log("Successfully completed task and returning plan.");
    return plan; 
};


const workerDefinition = {
    taskDefName: "generate_diet_plan_task", 
    execute: generateDietPlanWorker,       
    options: {
        pollInterval: 1000, 
        domain: "diet_planning" 
    }
};

const client = new ConductorClient(config);

const taskManager = new TaskManager(
    client, 
    [workerDefinition], 
    { 
        options: {
            concurrency: 5 
        }
    }
);

console.log("Starting Conductor Task Manager...");
taskManager.startPolling();
