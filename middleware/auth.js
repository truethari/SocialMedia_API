const jwt = require("jsonwebtoken");
const config = require("config");

const { User } = require("../models/user");

async function auth(req, res, next) {
    const token = req.header("x-auth-token");

    if (!token)
        return res
            .status(401)
            .json({ msg: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = decoded;

        const user = await User.findOne({ _id: req.user._id });

        if (!user) {
            return res.status(401).json({
                msg: `Invalid token`,
            });
        }

        next();
    } catch (ex) {
        res.status(400).json({ msg: "Invalid token." });
    }
}

module.exports = auth;
