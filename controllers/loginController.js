const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const { User } = require("../models/user");

exports.login = async (req, res) => {
    const { error } = validate(req.body);

    if (error) {
        return res.status(400).send({ msg: error.details[0].message });
    }

    const result = await User.findOne({ email: req.body.email }, "password");

    const vaildPassword = await bcrypt.compare(
        req.body.password,
        result.password
    );

    if (!vaildPassword) {
        return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign({ _id: result._id }, config.get("jwtPrivateKey"));

    res.json({ msg: "Login successful", token: token });
};

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
    });

    return schema.validate(req);
}
