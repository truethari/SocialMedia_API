const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { User, validate } = require("../models/user");
const data = require("../models/data");

exports.allUsers = async (req, res) => {
    const users = await User.find().select("-password -__v");

    if (!users.length) {
        return res.status(404).json({
            msg: "No users found",
        });
    }

    res.json(users);
};

exports.singleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select(
        "-password -__v"
    );

    if (!user) {
        return res.status(404).json({
            msg: `No user with the id of ${req.params.id}`,
        });
    }

    res.json(user);
};

exports.createUser = async (req, res) => {
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
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
    });

    user = await user.save();
    user.password = "protected";

    await data.incrementUserCreated();

    res.json(user);
};

exports.updateUser = async (req, res) => {
    let error;

    if (!req.body.fName && !req.body.lName && !req.body.email) {
        return res.status(400).json({
            msg: "Please provide fName or lName or email",
        });
    }

    const userObjectId = await User.findOne({ _id: req.params.id }, "_id");

    if (req.body.fName) {
        error = validate(req.body, ["email", "password"]).error;
        if (error) {
            return res.status(400).json({
                msg: error.details[0].message,
            });
        }

        const result = await User.updateOne(
            { _id: userObjectId },
            {
                fName: req.body.fName,
            }
        );

        if (!result) {
            return res.status(500).json({
                msg: "Something went wrong",
            });
        }
    }

    if (req.body.lName) {
        error = validate(req.body, ["fName", "email", "password"]).error;

        if (error) {
            return res.status(400).json({
                msg: error.details[0].message,
            });
        }

        const result = await User.updateOne(
            { _id: userObjectId },
            {
                lName: req.body.lName,
            }
        );

        if (!result) {
            return res.status(500).json({
                msg: "Something went wrong",
            });
        }
    }

    if (req.body.email) {
        error = validate(req.body, ["fName", "password"]).error;
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

        const result = await User.updateOne(
            { _id: userObjectId },
            {
                email: req.body.email,
            }
        );

        if (!result) {
            return res.status(500).json({
                msg: "Something went wrong",
            });
        }
    }

    if (req.body.password) {
        error = validate(req.body, ["fName", "email"]).error;
        if (error) {
            return res.status(400).json({
                msg: error.details[0].message,
            });
        }

        const result = await User.updateOne(
            { _id: userObjectId },
            {
                password: await bcrypt.hash(req.body.password, 10),
            }
        );

        if (!result) {
            return res.status(500).json({
                msg: "Something went wrong",
            });
        }
    }

    await data.incrementUserModified();

    res.json({
        msg: "User updated",
    });
};

exports.deleteUser = async (req, res) => {
    const result = await User.deleteOne({ userId: req.params.id });

    await data.incrementUserDeleted();

    res.send({
        msg: "User deleted",
    });
};

async function isEmailExists(email) {
    const result = await User.findOne({ email: email });
    return result ? false : true;
}
