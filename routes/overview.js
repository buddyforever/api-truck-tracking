var express = require("express");
var router = express.Router();

var db = require("../db");

router.get("/getLoginLogs/:id", (req, res) => {
  var userId = req.params.id;
  var query =
    "SELECT l.*, u.firstname, u.lastname FROM users_login l JOIN users u ON u.id=l.userId" +
    (userId != 1 ? " WHERE u.id=" + userId : " WHERE u.id!=1") +
    " ORDER BY l.login_at DESC LIMIT 5";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send({ status: 200, result: results });
  });
});

module.exports = router;
