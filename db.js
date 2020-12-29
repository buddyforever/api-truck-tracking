var mysql = require("mysql");
require("dotenv").config();

var dbconfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
};

var con = mysql.createConnection(dbconfig);

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;
