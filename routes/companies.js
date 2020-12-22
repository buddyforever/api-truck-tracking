var express = require("express");
var mysql = require("mysql");
var router = express.Router();

var con = mysql.createConnection({
  host: "localhost",
  database: "truck_tracking",
  user: "root",
  password: "",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

router.get("/get", (req, res) => {
  con.query("SELECT * FROM companies", function (error, results, fields) {
    if (error) throw error;
    res.send({ status: 200, result: results });
  });
});
module.exports = router;
