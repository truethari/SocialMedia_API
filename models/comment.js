const Joi = require("joi");
const mongoose = require("mongoose");

const Comment = mongoose.model(
    "Comment",
    new mongoose.Schema({
        postId: { type: String, required: true },
        userId: { type: String, required: true },
        body: String,
        datetime: { type: Date, default: Date.now },
    })
);

function validateComment(comment, notRequried = []) {
    const schema = Joi.object({
        body: notRequried.includes("body")
            ? Joi.string()
            : Joi.string().required(),
    });

    return schema.validate(comment);
}

module.exports.Comment = Comment;
module.exports.validate = validateComment;
