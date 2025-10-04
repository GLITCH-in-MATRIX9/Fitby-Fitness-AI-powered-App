// app.js
const express = require("express");
const cors = require("cors");
const videoRoutes = require("./routes/videoRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", videoRoutes);

module.exports = app;
