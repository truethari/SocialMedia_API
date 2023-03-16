const Joi = require("joi");
const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        userId: Number,
        fName: { type: String, required: true },
        lName: String,
        email: { type: String, required: true },
        password: { type: String, required: true },
        date: { type: Date, default: Date.now },
    })
);

function validateUser(user) {
    const schema = Joi.object({
        fName: Joi.string().min(3).required(),
        lName: Joi.string(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    });

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
