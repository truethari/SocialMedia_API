const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging");
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();

const server = app.listen(3000, () => {
    winston.info("Server is running on port 3000");
});

module.exports.server = server;
