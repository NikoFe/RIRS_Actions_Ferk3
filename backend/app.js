const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
//app.use(express.json());
app.use(bodyParser.json());
//app.use("/posts", postsRouter);
//app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

module.exports = app;

if (require.main === module) {
  app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}`)
  );
}
