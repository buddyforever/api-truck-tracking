var express = require("express");
var router = express.Router();

var db = require("../db");

router.post("/signin", (req, res) => {
  var user = {
    email: req.body.email,
    password: req.body.password,
    ip_address: req.body.ip_address,
  };
  console.log(user);
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
  db.query(
    "SELECT * FROM users WHERE email='" +
      user.email +
      "' AND password='" +
      user.password +
      "' AND status=1",
    function (error, results, fields) {
      if (error) throw error;
      if (results.length) {
        var query =
          "UPDATE users SET last_login='" + now + "' WHERE id=" + results[0].id;
        db.query(query, function (error, results1, fields) {
          if (error) throw error;
          db.query(
            "INSERT INTO users_login (userId, ip_address, login_at) VALUES (" +
              results[0].id +
              ", '" +
              user.ip_address +
              "', '" +
              now +
              "')",
            function (error, results2, fields) {
              if (error) throw error;
              res.send({ status: 200, result: results });
            }
          );
        });
      } else res.send({ status: 404 });
    }
  );
});
module.exports = router;
