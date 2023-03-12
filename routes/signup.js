const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const { validateUser } = require("../utils/validations");
const users = require("../assets/data/users.json");

router.post("/", async (req, res) => {
    const { error } = validateUser(req.body);

    if (error) {
        return res.status(400).json({
            msg: error.details[0].message,
        });
    }

    const newUser = {
        id: users.length + 1,
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        birthday: req.body.birthday,
        gender: req.body.gender,
        status: "active",
        password: await bcrypt.hash(req.body.password, 10),
    };

    users.push(newUser);
    res.json(users);
});

module.exports = router;
