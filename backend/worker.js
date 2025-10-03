require('dotenv').config();

// --- FIX: Import TaskManager instead of TaskWorker for reliable worker setup ---
const { ConductorClient, TaskManager } = require("conductor-javascript");
const OpenAI = require("openai");

// --- Configuration ---
const config = {
    serverUrl: "https://play.orkes.io/api", 
    keyId: process.env.ORKES_KEY_ID, 
    keySecret: process.env.ORKES_KEY_SECRET,
};

// --- TEMPORARY LOGGING FOR DEBUGGING AUTH ---
console.log("--- DEBUG CONFIG ---");
console.log(`Server URL: ${config.serverUrl}`);
// ONLY LOG THE KEY ID. NEVER LOG THE SECRET KEY in a real app, 
// but we need to verify its presence for this specific debug step.
console.log(`Key ID: ${config.keyId ? 'LOADED' : 'MISSING'}`);
console.log(`Key Secret Length: ${config.keySecret ? config.keySecret.length : 'MISSING'}`);
console.log(`Gemini Key Length: ${process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 'MISSING'}`);
console.log("--------------------");
// --- END TEMPORARY LOGGING ---


// Initialize OpenAI client with a network timeout
const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY, 
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    // --- NEW: Force a strict 20-second timeout for debugging stuck connections ---
    timeout: 20 * 1000, 
});

/**
 * The worker function that processes the task.
 * @param {Object} input - The input data from the Conductor task.
 * @returns {Object} - The output data for the Conductor task.
 */
const generateDietPlanWorker = async (input) => {
    // Log worker start
    console.log("Processing diet plan for user:", input);

    // Input comes directly from Conductor task payload (Workflow Input)
    const { age, gender, weight, fitnessGoal, preferences } = input;

    // Build the prompt string
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
        // --- CRITICAL STEP: API CALL ---
        const completion = await openai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        rawContent = completion.choices[0].message.content.trim();
        
    } catch (apiError) {
        // This catches network issues, invalid API key errors (401), or timeouts
        console.error("--- GEMINI API CALL FAILED ---");
        console.error("Error details:", apiError.message);
        console.error("------------------------------");
        // Force the task to fail with a clear message
        throw new Error(`External API Failure: ${apiError.message}`);
    }


    let plan;

    // --- JSON Parsing Logic ---
    let jsonString = rawContent;
    if (rawContent.startsWith('```')) {
        jsonString = rawContent.replace(/^```json\s*|```\s*$/g, '').trim();
    }

    try {
        plan = JSON.parse(jsonString);
    } catch (e) {
        console.error("Final JSON parsing failed:", e.message);
        // Throw an error to signal a task failure in Conductor
        throw new Error(`AI response was not valid JSON: ${rawContent}`);
    }
    
    console.log("Successfully completed task and returning plan.");
    // Return the final output object.
    return plan; 
};

// --- Worker Registration and Start using TaskManager ---

// 1. Define the worker configuration object
const workerDefinition = {
    taskDefName: "generate_diet_plan_task", 
    execute: generateDietPlanWorker,       
    options: {
        pollInterval: 1000, 
        domain: "diet_planning" 
    }
};

const client = new ConductorClient(config);

// 2. Initialize the TaskManager
const taskManager = new TaskManager(
    client, 
    [workerDefinition], 
    { 
        options: {
            concurrency: 5 
        }
    }
);

// 3. Start polling
console.log("Starting Conductor Task Manager...");
taskManager.startPolling();
