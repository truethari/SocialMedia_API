const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/", async (req, res) => await userController.allUsers(req, res));

router.get(
    "/:id",
    async (req, res) => await userController.singleUser(req, res)
);

router.post("/", async (req, res) => await userController.createUser(req, res));

router.put(
    "/:id",
    async (req, res) => await userController.updateUser(req, res)
);

router.delete(
    "/:id",
    async (req, res) => await userController.deleteUser(req, res)
);

module.exports = router;
