const express = require("express");
const router = express.Router();

router.use(express.json());

const { validateUser } = require("../utils/validations");
const users = require("../assets/data/users.json");

router.post("/", (req, res) => {
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
        password: req.body.password,
    };

    users.push(newUser);
    res.json(users);
});

module.exports = router;
