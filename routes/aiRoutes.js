const express = require("express");
const { generateAIContent } = require("../controllers/aiController");
const router = express.Router();

// CORS headers for AI routes
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL || "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Removed 'protect' middleware temporarily for testing
router.post("/generate", generateAIContent);

module.exports = router;