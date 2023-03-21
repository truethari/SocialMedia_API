const winston = require("winston");
const config = require("config");
require("express-async-errors");

winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", (ex) => {
    throw ex;
});

winston.add(
    new winston.transports.File({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        filename: "logfile.log",
    })
);
