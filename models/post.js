const Joi = require("joi");
const mongoose = require("mongoose");

const Post = mongoose.model(
    "Post",
    new mongoose.Schema({
        userId: { type: String, required: true },
        title: String,
        body: String,
        datetime: { type: Date, default: Date.now },
    })
);

function validatePost(post, notRequried = []) {
    const schema = Joi.object({
        title: notRequried.includes("title")
            ? Joi.string()
            : Joi.string().required(),
        body: notRequried.includes("body")
            ? Joi.string()
            : Joi.string().required(),
    });

    return schema.validate(post);
}

module.exports.Post = Post;
module.exports.validate = validatePost;
