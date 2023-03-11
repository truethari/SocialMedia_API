const express = require("express");
const users = require("./routes/users");
const posts = require("./routes/posts");
const signup = require("./routes/signup");

const app = express();

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/signup", signup);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
