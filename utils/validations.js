const Joi = require("joi");

/**
 * @param {JSON object} user Request body.
 * @param {array} notRequired Array of fields that are "not required" for the task.
 */
function validateUser(user, notRequired = []) {
    const schema = Joi.object({
        fName: notRequired.includes("fName")
            ? Joi.string().min(3)
            : Joi.string().min(3).required(),
        lName: notRequired.includes("lName")
            ? Joi.string()
            : Joi.string().required(),
        email: notRequired.includes("email")
            ? Joi.string().email()
            : Joi.string().required().email(),
        birthday: notRequired.includes("birthday")
            ? Joi.date()
            : Joi.date().required(),
        gender: notRequired.includes("gender")
            ? Joi.string()
            : Joi.string().required(),
        password: notRequired.includes("password")
            ? Joi.string()
            : Joi.string().required(),
    });

    return schema.validate(user);
}

/**
 * @param {JSON object} post Request body.
 * @param {array} notRequired Array of fields that are "not required" for the task.
 */
function validatePost(post, notRequired = []) {
    const schema = Joi.object({
        user: Joi.number().required(),
        body: notRequired.includes("body")
            ? Joi.string().min(3)
            : Joi.string().min(3).required(),
        tags: notRequired.includes("tags")
            ? Joi.array().items(Joi.number())
            : Joi.array().items(Joi.number()),
    });

    return schema.validate(post);
}

/**
 * @param {JSON object} comment Request body.
 * @param {array} notRequired Array of fields that are "not required" for the task.
 */
function validateComment(comment, notRequired = []) {
    const schema = Joi.object({
        user: Joi.number().required(),
        body: Joi.string().min(3).required(),
    });

    return schema.validate(comment);
}

module.exports.validateUser = validateUser;
module.exports.validatePost = validatePost;
module.exports.validateComment = validateComment;
