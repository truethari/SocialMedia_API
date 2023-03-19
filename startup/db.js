const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function () {
    mongoose.connect(config.get("dbConnectionString")).then(() => {
        winston.info("Connected to MongoDB");
    });
};
