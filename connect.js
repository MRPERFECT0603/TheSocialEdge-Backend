const mysql  = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Mysql@0603",
    database:"TheSocialEdge"
});


module.exports =  db ;