const mysql = require("mysql");
const config = require("config");

let connection;

async function createConnection() {
    return new Promise((resolve, reject) => {
        connection = mysql.createConnection({
            host: config.get("db.host"),
            user: config.get("db.username"),
            database: config.get("db.database"),
        });

        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

async function closeConnection() {
    return new Promise((resolve, reject) => {
        connection.end((err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

async function runner(sql, params) {
    const command = mysql.format(sql, params);

    await createConnection();
    return new Promise((resolve, reject) => {
        connection.query(command, async function (err, results) {
            if (err) {
                reject(err.message);
            }
            resolve(results);
            await closeConnection();
        });
    });
}

async function sqlCommand(sql, params = []) {
    const result = await runner(sql, params)
        .then((result) => {
            return JSON.parse(JSON.stringify(result));
        })
        .catch((err) => {
            throw new Error(err);
        });
    return result;
}

module.exports = sqlCommand;
