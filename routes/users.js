const express = require("express");
const Joi = require("joi");
const router = express.Router();

router.use(express.json());

const users = require("../assets/data/users.json");

router.get("/", (req, res) => {
    res.json(users);
});

router.get("/:id", (req, res) => {
    const found = users.some((user) => user.id === parseInt(req.params.id));

    if (found) {
        res.json(users.filter((user) => user.id === parseInt(req.params.id)));
    } else {
        res.status(400).json({
            msg: `No user with the id of ${req.params.id}`,
        });
    }
});

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
    };

    users.push(newUser);
    res.json(users);
});

router.put("/:id", (req, res) => {
    const { error } = validateUser(req.body);

    if (error) {
        return res.status(400).json({
            msg: error.details[0].message,
        });
    }

    const found = users.some((user) => user.id === parseInt(req.params.id));

    if (found) {
        const updUser = req.body;
        users.forEach((user) => {
            if (user.id === parseInt(req.params.id)) {
                user.fName = updUser.fName ? updUser.fName : user.fName;
                user.lName = updUser.lName ? updUser.lName : user.lName;
                user.email = updUser.email ? updUser.email : user.email;
                user.birthday = updUser.birthday
                    ? updUser.birthday
                    : user.birthday;

                res.json({
                    msg: "User updated",
                    user,
                });
            }
        });
    } else {
        res.status(400).json({
            msg: `No user with the id of ${req.params.id}`,
        });
    }
});

router.delete("/:id", (req, res) => {
    const found = users.some((user) => user.id === parseInt(req.params.id));

    if (found) {
        res.json({
            msg: "User deleted",
            users: users.filter((user) => user.id !== parseInt(req.params.id)),
        });
    } else {
        res.status(400).json({
            msg: `No user with the id of ${req.params.id}`,
        });
    }
});

function validateUser(user) {
    const schema = Joi.object({
        fName: Joi.string().required(),
        lName: Joi.string().required(),
        email: Joi.string().required().email(),
        birthday: Joi.date().required(),
        gender: Joi.string().required(),
    });

    return schema.validate(user);
}

module.exports = router;
