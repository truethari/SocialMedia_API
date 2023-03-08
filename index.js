const express = require("express");

const users = require("./assets/data/users.json");
const posts = require("./assets/data/posts.json");
const comments = require("./assets/data/comments.json");

const app = express();

app.get("/api/users", (req, res) => {
    res.json(users);
});

app.get("/api/posts", (req, res) => {
    res.json(posts);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
