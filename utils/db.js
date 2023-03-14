const mysql = require("mysql");
const config = require("config");

const connection = mysql.createConnection({
    host: config.get("db.host"),
    user: config.get("db.username"),
    database: config.get("db.database"),
});

console.log(config.get("db.database"));

connection.connect((err) => {
    if (err) throw err;
    console.log("DB Connected!");
});

function runner(sql, params) {
    const command = mysql.format(sql, params);
    return new Promise((resolve, reject) => {
        connection.query(command, function (err, results) {
            if (err) {
                reject(err.message);
            }
            resolve(results);
        });
    });
}

async function sqlCommand(sql, params = []) {
    const result = await runner(sql, params)
        .then((result) => {
            return JSON.parse(JSON.stringify(result));
        })
        .catch((err) => {
            return err;
        });
    return result;
}

module.exports = sqlCommand;
