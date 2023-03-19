const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get(
    "/",
    auth,
    async (req, res) => await userController.allUsers(req, res)
);

router.get(
    "/:id",
    auth,
    async (req, res) => await userController.singleUser(req, res)
);

router.post("/", async (req, res) => await userController.createUser(req, res));

router.put(
    "/:id",
    auth,
    async (req, res) => await userController.updateUser(req, res)
);

router.delete(
    "/:id",
    auth,
    async (req, res) => await userController.deleteUser(req, res)
);

module.exports = router;
