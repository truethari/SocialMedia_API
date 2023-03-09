const express = require("express");
const router = express.Router();

const posts = require("../assets/data/posts.json");

router.get("/", (req, res) => {
    res.json(posts);
});

module.exports = router;
