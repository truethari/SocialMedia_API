const Joi = require("joi");
const mongoose = require("mongoose");

const Comment = mongoose.model(
    "Comment",
    new mongoose.Schema({
        commentId: { type: Number, required: true },
        postId: { type: Number, required: true },
        userId: { type: String, required: true },
        body: String,
        datetime: { type: Date, default: Date.now },
    })
);

function validateComment(comment, notRequried = []) {
    const schema = Joi.object({
        postId: notRequried.includes("postId")
            ? Joi.number()
            : Joi.number().required(),
        body: notRequried.includes("body")
            ? Joi.string()
            : Joi.string().required(),
    });

    return schema.validate(comment);
}

module.exports.Comment = Comment;
module.exports.validate = validateComment;
