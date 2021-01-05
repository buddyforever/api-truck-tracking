var express = require("express");
var router = express.Router();

var db = require("../db");

router.get("/get", (req, res) => {
  db.query("SELECT * FROM transporters", function (error, results, fields) {
    if (error) throw error;
    res.send({ status: 200, result: results });
  });
});
router.post("/add", (req, res) => {
  var dt = new Date();
  var now =
    dt.getFullYear() +
    "-" +
    (dt.getMonth() + 1) +
    "-" +
    dt.getDate() +
    " " +
    dt.getHours() +
    ":" +
    dt.getMinutes() +
    ":" +
    dt.getSeconds();
  var transporter = {
    transporter: req.body.transporter,
    created_at: now,
  };
  var query =
    "INSERT INTO transporters (transporter, created_at) VALUES ('" +
    transporter.transporter +
    "', '" +
    transporter.created_at +
    "')";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    db.query("SELECT * FROM transporters", function (error, results, fields) {
      if (error) throw error;
      res.send({ status: 200, result: results });
    });
  });
});
router.post("/update", (req, res) => {
  var dt = new Date();
  var now =
    dt.getFullYear() +
    "-" +
    (dt.getMonth() + 1) +
    "-" +
    dt.getDate() +
    " " +
    dt.getHours() +
    ":" +
    dt.getMinutes() +
    ":" +
    dt.getSeconds();
  var transporter = {
    id: req.body.id,
    transporter: req.body.transporter,
    updated_at: now,
  };
  var query =
    "UPDATE transporters SET transporter='" +
    transporter.transporter +
    "', updated_at='" +
    transporter.updated_at +
    "' WHERE id=" +
    transporter.id;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    db.query("SELECT * FROM transporters", function (error, results, fields) {
      if (error) throw error;
      res.send({ status: 200, result: results });
    });
  });
});
router.post("/delete/:id", (req, res) => {
  var transId = req.params.id;
  var query = "DELETE FROM transporters WHERE id=" + transId;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    db.query("SELECT * FROM transporters", function (error, results, fields) {
      if (error) throw error;
      res.send({ status: 200, result: results });
    });
  });
});
router.get("/:id", (req, res) => {
  var transId = req.params.id;
  var query = "SELECT * FROM transporters WHERE id=" + transId;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send({ status: 200, result: results });
  });
});
module.exports = router;
