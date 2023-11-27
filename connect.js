const mysql = require("mysql");

const db = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: "TheSocialEdge"
});


module.exports = db;