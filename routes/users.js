const express = require("express");
const router = express.Router();

const users = require("../assets/data/users.json");

router.get("/", (req, res) => {
    res.json(users);
});

module.exports = router;
