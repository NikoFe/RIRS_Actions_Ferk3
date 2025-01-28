const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");

const app = express();
app.use(cors());
//app.use(express.json());
app.use(bodyParser.json());
app.use("/posts", postsRouter);
app.use("/users", usersRouter);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
