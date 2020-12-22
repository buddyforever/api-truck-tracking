var express = require("express");
var router = express.Router();

var db = require("../db");

router.post("/signin", (req, res) => {
  var user = {
    email: req.body.email,
    password: req.body.password,
  };
  db.query(
    "SELECT * FROM users WHERE email='" +
      user.email +
      "' AND password='" +
      user.password +
      "' AND status=1",
    function (error, results, fields) {
      if (error) throw error;
      if (results.length) res.send({ status: 200, result: results });
      else res.send({ status: 404 });
    }
  );
});
module.exports = router;
