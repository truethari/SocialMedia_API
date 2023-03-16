const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const sqlCommand = require("../utils/db");

const { User, validate } = require("../models/users");

const { getNewUserId } = require("../models/data");

// router.get("/me", auth, (req, res) => {
//     const user = users.filter((user) => user.id === req.user._id);
//     res.json(user);
// });

router.get("/", auth, async (req, res) => {
    const users = await sqlCommand("SELECT * FROM users;");

    if (!users.length) {
        return res.status(404).json({
            msg: "No users found",
        });
    }

    res.json(users);
});

router.get("/:id", auth, async (req, res) => {
    const user = await sqlCommand("SELECT * FROM users WHERE id=?;", [
        req.params.id,
    ]);

    if (!user.length) {
        return res.status(404).json({
            msg: `No user with the id of ${req.params.id}`,
        });
    }

    res.json(user);
});

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);

    if (error) {
        return res.status(400).json({
            msg: error.details[0].message,
        });
    }

    const validEmail = await isEmailExists(req.body.email);

    if (!validEmail) {
        return res.status(400).json({
            msg: "Email already exists",
        });
    }

    let user = new User({
        userId: await getNewUserId(),
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        password: req.body.password,
    });

    user = await user.save();
    res.send(user);
});

router.put("/:id", auth, async (req, res) => {
    const { error } = validateUser(req.body, [
        "fName",
        "lName",
        "email",
        "birthday",
        "gender",
        "status",
        "role",
        "password",
    ]);

    if (
        !req.body.fName &&
        !req.body.lName &&
        !req.body.email &&
        !req.body.birthday &&
        !req.body.gender &&
        !req.body.status &&
        !req.body.role &&
        !req.body.password
    ) {
        return res.status(400).json({
            msg: "No data to update",
        });
    }

    if (error) {
        return res.status(400).json({
            msg: error.details[0].message,
        });
    }

    let cmd;
    // each field is optional, so we need to check if it exists before updating
    if (req.body.fName) {
        cmd = await sqlCommand("UPDATE users SET fName=? WHERE id=?;", [
            req.body.fName,
            req.params.id,
        ]);
    }

    if (req.body.lName) {
        cmd = await sqlCommand("UPDATE users SET lName=? WHERE id=?;", [
            req.body.lName,
            req.params.id,
        ]);
    }

    if (req.body.email) {
        cmd = await sqlCommand("UPDATE users SET email=? WHERE id=?;", [
            req.body.email,
            req.params.id,
        ]);
    }

    if (req.body.birthday) {
        cmd = await sqlCommand("UPDATE users SET birthday=? WHERE id=?;", [
            req.body.birthday,
            req.params.id,
        ]);
    }

    if (req.body.gender) {
        cmd = await sqlCommand("UPDATE users SET gender=? WHERE id=?;", [
            req.params.birthday,
            req.params.id,
        ]);
    }

    if (req.body.status) {
        cmd = await sqlCommand("UPDATE users SET status=? WHERE id=?;", [
            req.body.status,
            req.params.id,
        ]);
    }

    if (req.body.role) {
        cmd = await sqlCommand("UPDATE users SET role=? WHERE id=?;", [
            req.body.role,
            req.params.id,
        ]);
    }

    if (req.body.password) {
        cmd = await sqlCommand("UPDATE users SET password=? WHERE id=?;", [
            req.body.password,
            req.params.id,
        ]);
    }

    if (!cmd.affectedRows) {
        return res.status(404).json({
            msg: `No user with the id of ${req.params.id}`,
        });
    }

    res.json({
        msg: "User updated",
    });
});

router.delete("/:id", auth, async (req, res) => {
    const cmd = await sqlCommand("SELECT * FROM users WHERE id=?;", [
        req.params.id,
    ]);

    if (!cmd.length) {
        return res.status(404).json({
            msg: `No user with the id of ${req.params.id}`,
        });
    }

    const cmd2 = await sqlCommand("DELETE FROM users WHERE id=?;", [
        req.params.id,
    ]);

    if (!cmd2.affectedRows) {
        return res.status(500).json({
            msg: "Something went wrong",
        });
    }

    res.send({
        msg: "User deleted",
    });
});

async function isEmailExists(email) {
    const result = await User.findOne({ email: email });
    return result ? false : true;
}

module.exports = router;
