const config = require("config");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

router.use(express.json());

const users = require("../assets/data/users.json");

router.post("/", async (req, res) => {
    const found = users.some((user) => user.id === req.body.id);

    if (!found) {
        return res.status(400).json({
            msg: `No user with the id of ${req.body.id}`,
        });
    }

    const user = users.filter((user) => user.id === req.body.id);

    const match = await bcrypt.compare(req.body.password, user[0].password);

    if (!match) {
        return res.status(400).json({
            msg: "Invalid credentials",
        });
    } else {
        const token = jwt.sign(
            { _id: user[0].id },
            config.get("jwtPrivateKey")
        );
        res.header("x-auth-token", token).json({
            msg: "User authenticated",
            user,
        });
    }
});

module.exports = router;
