const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const { validateUser } = require("../utils/validations");
const users = require("../assets/data/users.json");

const sqlCommand = require("../utils/db");

router.post("/", async (req, res) => {
    const { error } = validateUser(req.body, ["birthday", "gender", "status"]);

    if (error) {
        return res.status(400).json({
            msg: error.details[0].message,
        });
    }

    console.log(
        `INSERT INTO VALUES (fName = ?, lName = ?, email = ?,${
            req.body.birthday ? "birthday = ?," : ""
        }${req.body.gender ? "gender = ?," : ""}${
            req.body.role ? "role = ?," : ""
        }password = ?);`
    );

    const cmd = await sqlCommand(
        "INSERT INTO users (fName, lName, email, birthday, gender, status, role, password) VALUES (? , ? , ? , ? , ? , ? , ? , ?);",
        [
            req.body.fName,
            req.body.lName,
            req.body.email,
            req.body.birthday,
            req.body.gender,
            req.body.status,
            req.body.role,
            await bcrypt.hash(req.body.password, 10),
        ]
    );

    res.json(cmd);
});

router.delete("/:id", async (req, res) => {
    const cmd = await sqlCommand("DELETE FROM users WHERE id=?;", [
        req.params.id,
    ]);

    if (!cmd.affectedRows) {
        return res.status(404).json({
            msg: `No user with the id of ${req.params.id}`,
        });
    } else {
        res.json(cmd);
    }
});

module.exports = router;
