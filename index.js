require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const express = require("express");
const mongoose = require("mongoose");

const error = require("./middleware/error");

const users = require("./routes/users");
const posts = require("./routes/posts");
const signin = require("./routes/signin");

const app = express();

winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", (ex) => {
    throw ex;
});

winston.add(new winston.transports.File({ filename: "logfile.log" }));

const connectionString = `mongodb://${config.get("db.host")}:${config.get(
    "db.port"
)}/${config.get("db.name")}`;

winston.add(
    new winston.transports.MongoDB({
        db: connectionString,
        options: {
            useUnifiedTopology: true,
        },
    })
);

mongoose
    .connect(connectionString)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Could not connect to MongoDB", err);
    });

app.use(express.json());
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/signin", signin);

app.use(error);

const server = app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

module.exports.server = server;
