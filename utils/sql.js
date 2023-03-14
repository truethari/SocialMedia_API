const mysql = require("mysql");
const config = require("config");

const connection = mysql.createConnection({
    host: config.get("db.host"),
    user: config.get("db.username"),
    database: config.get("db.database"),
});

connection.connect((err) => {
    if (err) throw err;
    console.log("DB Connected!");
});

function runner(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, results) {
            if (err) {
                reject(err.message);
            }
            resolve(results);
        });
    });
}

async function sqlCommand(sql) {
    const result = await runner(sql)
        .then((result) => {
            return JSON.stringify(result);
        })
        .catch((err) => {
            return err;
        });
    return result;
}

module.exports = sqlCommand;
