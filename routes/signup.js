const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const { validateUser } = require("../utils/validations");

const sqlCommand = require("../utils/db");

router.post("/", async (req, res) => {
    const { error } = validateUser(req.body, [
        "birthday",
        "gender",
        "status",
        "role",
    ]);

    if (error) {
        return res.status(400).json({
            msg: error.details[0].message,
        });
    }

    const cmd = await sqlCommand("SELECT * FROM users WHERE email=?;", [
        req.body.email,
    ]);

    if (cmd.length) {
        return res.status(400).json({
            msg: `User with email ${req.body.email} already exists`,
        });
    }

    const cmd2 = await sqlCommand(
        "INSERT INTO users (fName, lName, email, password) VALUES (? , ? , ? , ?);",
        [
            req.body.fName,
            req.body.lName,
            req.body.email,
            await bcrypt.hash(req.body.password, 10),
        ]
    );

    if (req.body.birthday) {
        await sqlCommand("UPDATE users SET birthday=? WHERE id=?;", [
            req.body.birthday,
            cmd2.insertId,
        ]);
    }

    if (req.body.gender) {
        await sqlCommand("UPDATE users SET gender=? WHERE id=?;", [
            req.body.gender,
            cmd2.insertId,
        ]);
    }

    if (req.body.status) {
        await sqlCommand("UPDATE users SET status=? WHERE id=?;", [
            req.body.status,
            cmd2.insertId,
        ]);
    }

    if (req.body.role) {
        await sqlCommand("UPDATE users SET role=? WHERE id=?;", [
            req.body.role,
            cmd2.insertId,
        ]);
    }

    res.json({
        msg: "User created",
    });
});

module.exports = router;
