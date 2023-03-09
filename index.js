const express = require("express");
const users = require("./routes/users");
const posts = require("./routes/posts");
const comments = require("./routes/comments");

const app = express();

app.use("/api/users", users);
app.use("/api/posts", posts);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
