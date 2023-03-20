const express = require("express");
const router = express.Router();

const { User } = require("../models/user");

const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

const middleware = {
    auth,
    isAuthorized,
};

router.get(
    "/",
    middleware.auth,
    async (req, res) => await userController.allUsers(req, res)
);

router.get(
    "/:id",
    middleware.auth,
    async (req, res) => await userController.singleUser(req, res)
);

router.post("/", async (req, res) => await userController.createUser(req, res));

router.put(
    "/:id",
    [middleware.auth, middleware.isAuthorized],
    async (req, res) => await userController.updateUser(req, res)
);

router.delete(
    "/:id",
    [middleware.auth, middleware.isAuthorized],
    async (req, res) => await userController.deleteUser(req, res)
);

async function isAuthorized(req, res, next) {
    const userObjectId = await User.findOne({ userId: req.params.id }, "_id");

    if (!userObjectId) {
        return res.status(404).json({
            msg: `No user with the id of ${req.params.id}`,
        });
    }

    if (req.user._id.localeCompare(userObjectId._id.toString())) {
        return res.status(401).json({
            msg: "Unauthorized",
        });
    }

    next();
}

module.exports = router;
