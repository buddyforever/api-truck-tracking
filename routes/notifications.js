var express = require("express");
var router = express.Router();

var db = require("../db");

router.get("/getUnread", (req, res) => {
  db.query(
    "SELECT u.*, n.*, n.id as id, n.status as status, n.created_at as created_at FROM notifications n JOIN users u ON u.id=n.userId WHERE n.status=0 ORDER BY n.created_at DESC",
    function (error, results, fields) {
      if (error) throw error;
      res.send({ status: 200, result: results });
    }
  );
});
router.get("/get", (req, res) => {
  db.query(
    "SELECT u.*, n.*, n.id as id, n.status as status, n.created_at as created_at FROM notifications n JOIN users u ON u.id=n.userId ORDER BY n.created_at DESC",
    function (error, results, fields) {
      if (error) throw error;
      res.send({ status: 200, result: results });
    }
  );
});
router.post("/markAllAsRead", (req, res) => {
  db.query(
    "UPDATE notifications SET status=1 WHERE status=0",
    function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      if (results.affectedRows) {
        db.query(
          "SELECT u.*, n.*, n.id as id, n.status as status, n.created_at as created_at FROM notifications n JOIN users u ON u.id=n.userId ORDER BY n.created_at DESC",
          function (error, results1, fields) {
            if (error) throw error;
            res.send({ status: 200, result: results1 });
          }
        );
      } else res.send({ status: 404 });
    }
  );
});
module.exports = router;
