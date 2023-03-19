const config = require("config");

module.exports = function () {
    if (!config.get("jwtPrivateKey")) {
        throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
    }

    if (!config.get("dbConnectionString")) {
        throw new Error("FATAL ERROR: dbConnectionString is not defined.");
    }
};
