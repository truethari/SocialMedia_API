require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();

winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", (ex) => {
    throw ex;
});

winston.add(new winston.transports.File({ filename: "logfile.log" }));

winston.add(
    new winston.transports.MongoDB({
        db: config.get("dbConnectionString"),
        options: {
            useUnifiedTopology: true,
        },
    })
);

const server = app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

module.exports.server = server;
