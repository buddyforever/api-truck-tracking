var express = require("express");
var router = express.Router();

var db = require("../db");

router.get("/getDailyTruckNum", (req, res) => {
  var queryTableNumLoaded =
    "SELECT dates.date, COUNT(*) as numTruckLoaded FROM submit_logs sl JOIN (SELECT submitDate as date FROM submit_logs GROUP BY submitDate) dates ON sl.submitDate=dates.date WHERE sl.dealStatus=2 GROUP BY dates.date";
  var queryTableNumUnloaded =
    "SELECT dates.date, COUNT(*) as numTruckUnLoaded FROM submit_logs sl JOIN (SELECT submitDate as date FROM submit_logs GROUP BY submitDate) dates ON sl.submitDate=dates.date WHERE sl.dealStatus=4 GROUP BY dates.date";
  var query =
    "SELECT DATE_FORMAT(tbl1.date, '%Y-%m-%d') as date, tbl1.numTruckLoaded, tbl2.numTruckUnloaded FROM (" +
    queryTableNumLoaded +
    ") as tbl1 JOIN (" +
    queryTableNumUnloaded +
    ") tbl2 ON tbl1.date=tbl2.date";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0)
      res.send({
        status: 200,
        result: results,
      });
  });
});
router.get("/getTruckDataHistory/:cid", (req, res) => {
  var companyId = req.params.cid;
  var query = "";
  if (companyId == 1)
    query =
      "SELECT DATE_FORMAT(d.finishUnloadingAt, '%Y-%m-%d') as date, t.transporter, d.driverName, (d.netWeight-d.newNetWeight) as netLoss, DATE_FORMAT(d.finishLoadingAt, '%Y-%m-%d %H:%i:%s') as timeLoaded, DATE_FORMAT(d.startUnloadingAt, '%Y-%m-%d %H:%i:%s') as timeArrived, DATE_FORMAT(d.finishUnloadingAt, '%Y-%m-%d %H:%i:%s') as timeUnloaded FROM deals d LEFT JOIN transporters t ON d.transporterId=t.id WHERE d.status=4 AND d.companyId=1";
  else if (companyId == 2)
    query =
      "SELECT DATE_FORMAT(d.finishUnloadingAt, '%Y-%m-%d') as date, t.transporter, d.driverName, (d.quantity-d.newQuantity) as netLoss, DATE_FORMAT(d.finishLoadingAt, '%Y-%m-%d %H:%i:%s') as timeLoaded, DATE_FORMAT(d.startUnloadingAt, '%Y-%m-%d %H:%i:%s') as timeArrived, DATE_FORMAT(d.finishUnloadingAt, '%Y-%m-%d %H:%i:%s') as timeUnloaded FROM deals d LEFT JOIN transporters t ON d.transporterId=t.id WHERE d.status=4 AND d.companyId=2";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send({
      status: 200,
      result: results,
    });
  });
});
module.exports = router;
