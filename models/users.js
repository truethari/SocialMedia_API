const Joi = require("joi");
const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        userId: Number,
        fName: { type: String, required: true },
        lName: String,
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        datetime: { type: Date, default: Date.now },
    })
);

function validateUser(user, notRequried = []) {
    const schema = Joi.object({
        fName: notRequried.includes("fName")
            ? Joi.string().min(3)
            : Joi.string().min(3).required(),
        lName: Joi.string(),
        email: notRequried.includes("email")
            ? Joi.string().email()
            : Joi.string().required().email(),
        password: notRequried.includes("password")
            ? Joi.string()
            : Joi.string().required(),
    });

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
