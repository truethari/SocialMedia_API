const express = require("express");
const router = express.Router();
const Joi = require("joi");

const auth = require("../middleware/auth");
const users = require("../assets/data/users.json");

// router.get("/me", auth, (req, res) => {
//     const user = users.filter((user) => user.id === req.user._id);
//     res.json(user);
// });

router.get("/", auth, (req, res) => {
    res.json(users);
});

router.get("/:id", auth, (req, res) => {
    const found = users.some((user) => user.id === parseInt(req.params.id));

    if (found) {
        res.json(users.filter((user) => user.id === parseInt(req.params.id)));
    } else {
        res.status(400).json({
            msg: `No user with the id of ${req.params.id}`,
        });
    }
});

router.post("/", auth, (req, res) => {
    res.status(423).json({
        msg: "POST requests are locked",
    });
});

router.put("/:id", auth, (req, res) => {
    const schema = Joi.object({
        fName: Joi.string().min(3),
        lName: Joi.string(),
        email: Joi.string().email(),
        birthday: Joi.date(),
        gender: Joi.string(),
        password: Joi.string(),
    });

    const { error } = schema.validate(req.body);

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

router.delete("/:id", auth, (req, res) => {
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

module.exports = router;
