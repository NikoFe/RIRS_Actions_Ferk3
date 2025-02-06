const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "artholus6*Databa5e",
  database: "express",
};

router.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM User");
    res.json(rows);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute(
    "SELECT * FROM User WHERE username = ? AND password = ?",
    [username, password]
  );

  if (rows.length > 0) {
    res.json({ user: rows[0] });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

module.exports = router;
