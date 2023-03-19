const express = require("express");
const router = express.Router();

const { User } = require("../models/user");

const loginController = require("../controllers/loginController");

const middleware = { checkUserExists };

router.post(
    "/",
    middleware.checkUserExists,
    async (req, res) => await loginController.login(req, res)
);

async function checkUserExists(req, res, next) {
    if (!req.body.email) {
        return res.status(400).json({
            msg: "Email is required",
        });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({
            msg: `No user with the email of ${req.body.email}`,
        });
    }

    next();
}

module.exports = router;
