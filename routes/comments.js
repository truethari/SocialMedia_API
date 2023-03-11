const express = require("express");
const router = express.Router();

router.use(express.json());

const comments = require("../assets/data/comments.json");

router.get("/", (req, res) => {
    res.json(comments);
});

module.exports = router;
