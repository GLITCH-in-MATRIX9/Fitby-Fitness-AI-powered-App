// const express = require("express");
// const router = express.Router();
// const { generateDietPlan } = require("../controllers/dietPlanController");

// router.post("/generate", generateDietPlan);

// module.exports = router;

// // backend/routes/orkesDietPlanRoutes.js
const express = require("express");
const router = express.Router();
const { generateDietPlanTask } = require("../controllers/dietPlanController");

router.post("/task", generateDietPlanTask); // this will be called by Orkes

module.exports = router;
