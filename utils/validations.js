const Joi = require("joi");

function validateUser(user) {
    const schema = Joi.object({
        fName: Joi.string().min(3).required(),
        lName: Joi.string().required(),
        email: Joi.string().required().email(),
        birthday: Joi.date().required(),
        gender: Joi.string().required(),
        password: Joi.string().required(),
    });

    return schema.validate(user);
}

module.exports.validateUser = validateUser;
