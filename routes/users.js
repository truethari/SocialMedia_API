const express = require("express");
const router = express.Router();

const { User } = require("../models/user");

const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const { default: mongoose } = require("mongoose");

const middleware = {
    auth,
    isIdValid,
    isAuthorized,
};

router.get(
    "/",
    middleware.auth,
    async (req, res) => await userController.allUsers(req, res)
);

router.get(
    "/:id",
    [middleware.auth, middleware.isIdValid],
    async (req, res) => await userController.singleUser(req, res)
);

router.post("/", async (req, res) => await userController.createUser(req, res));

router.put(
    "/:id",
    [middleware.auth, middleware.isIdValid, middleware.isAuthorized],
    async (req, res) => await userController.updateUser(req, res)
);

router.delete(
    "/:id",
    [middleware.auth, middleware.isIdValid, middleware.isAuthorized],
    async (req, res) => await userController.deleteUser(req, res)
);

async function isIdValid(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            msg: "Invalid ID",
        });
    }

    next();
}

async function isAuthorized(req, res, next) {
    const userObject = await User.findOne({ _id: req.params.id }, "_id");

    if (!userObject) {
        return res.status(404).json({
            msg: `No user with the id of ${req.params.id}`,
        });
    }

    if (req.user._id.localeCompare(userObject._id.toString())) {
        return res.status(401).json({
            msg: "Unauthorized",
        });
    }

    next();
}

module.exports = router;
