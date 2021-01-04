var express = require("express");
var router = express.Router();

var db = require("../db");

router.get("/get", (req, res) => {
  db.query("SELECT * FROM products", function (error, results, fields) {
    if (error) throw error;
    res.send({ status: 200, result: results });
  });
});
module.exports = router;
