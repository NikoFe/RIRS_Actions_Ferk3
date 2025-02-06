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
    const [rows] = await connection.execute("SELECT * FROM Post");
    res.json(rows);
  } catch (error) {
    console.error("Error inserting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM Post WHERE name = ?",
      [req.params.name]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error inserting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, parts, user_username, price } = req.body;

    // Validate request body to ensure no missing values
    if (!name || !parts || !user_username || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO Post (name, parts, user_username, price) VALUES (?, ?, ?, ?)",
      [name, parts, user_username, price]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.sendStatus(201);
  } catch (error) {
    console.error("Error inserting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:name", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "DELETE FROM Post WHERE name = ?",
      [req.params.name]
    );
    await connection.end(); // Close DB connection

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:name", async (req, res) => {
  try {
    const { parts, price } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    console.log("PRICE: ", price);
    const [result] = await connection.execute(
      "UPDATE Post SET parts = ?, price=? WHERE name = ?",
      [parts, price]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
