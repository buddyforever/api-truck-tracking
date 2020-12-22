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

router.post("/signin", (req, res) => {
  var user = {
    email: req.body.email,
    password: req.body.password,
  };
  con.query(
    "SELECT * FROM users WHERE email=" +
      user.email +
      " AND password=" +
      user.password +
      " AND status=1",
    function (error, results, fields) {
      if (error) throw error;
      console.log(results);
    }
  );
});
module.exports = router;
