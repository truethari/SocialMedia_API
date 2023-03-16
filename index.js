const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/users");
const posts = require("./routes/posts");
const signin = require("./routes/signin");

const app = express();

mongoose
    .connect("mongodb://127.0.0.1:27017/socialmedia_api")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Could not connect to MongoDB", err);
    });

app.use(express.json());
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/signin", signin);

const server = app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

module.exports.server = server;
