router.delete("/:name", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute("DELETE FROM Post WHERE name = ?", [
      req.params.name,
    ]);
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