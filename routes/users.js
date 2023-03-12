const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

router.use(express.json());

const { validateUser } = require("../utils/validations");
const users = require("../assets/data/users.json");

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

router.put("/:id", auth, (req, res) => {
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
