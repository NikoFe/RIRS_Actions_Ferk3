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
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute("SELECT * FROM Post");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { name, parts, user_username, concatenated, price } = req.body;
  //console.log(
  //  "name: " + name + " parts: " + concatenated + " username: " + user_username
  //  );
  const connection = await mysql.createConnection(dbConfig);
  await connection.execute(
    "INSERT INTO Post (name, parts, user_username, price) VALUES (?, ?, ?, ?)",
    [name, concatenated, user_username, price]
  );
  res.sendStatus(201);
});

router.delete("/:name", async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  await connection.execute("DELETE FROM Post WHERE name = ?", [
    req.params.name,
  ]);
  res.sendStatus(200);
});

router.put("/:name", async (req, res) => {
  const { parts, price } = req.body;
  const connection = await mysql.createConnection(dbConfig);
  console.log("PRICE: ", price);
  await connection.execute(
    "UPDATE Post SET parts = ?, price=? WHERE name = ?",
    [parts, price, req.params.name]
  );
  res.sendStatus(200);
});

module.exports = router;
