const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

router.use(express.json());

const { validateUser } = require("../utils/validations");
const users = require("../assets/data/users.json");

router.get("/", async (req, res) => {
    res.json(users);
});

module.exports = router;
