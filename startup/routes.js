const express = require("express");

const error = require("../middleware/error");
const login = require("../routes/login");
const users = require("../routes/users");
const posts = require("../routes/posts");
const signin = require("../routes/signin");

module.exports = function (app) {
    app.use(express.json());
    app.use("/api/users", users);
    app.use("/api/posts", posts);
    app.use("/api/signin", signin);
    app.use("/api/login", login);
    app.use(error);
};
