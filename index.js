const express = require("express");
const app = express();

require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();

const server = app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

module.exports.server = server;
