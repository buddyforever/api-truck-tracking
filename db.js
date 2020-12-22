var mysql = require("mysql");
var con = mysql.createConnection({
  host: "38.17.53.108",
  database: "truck_tracking",
  user: "root",
  password: "goqkdtks.123",
  port: 17154,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;
