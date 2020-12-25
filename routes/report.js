var express = require("express");
var router = express.Router();

var db = require("../db");

router.get("/getDailyTruckNum/:cid", (req, res) => {
  var companyId = req.params.cid;
  var queryTableNumLoaded =
    "SELECT dates.date, COUNT(*) as numTruckLoaded FROM submit_logs sl JOIN (SELECT submitDate as date FROM submit_logs GROUP BY submitDate) dates ON sl.submitDate=dates.date JOIN deals d ON sl.dealId=d.id WHERE sl.dealStatus=2 AND d.companyId=" +
    companyId +
    " GROUP BY dates.date";
  var queryTableNumUnloaded =
    "SELECT dates.date, COUNT(*) as numTruckUnLoaded FROM submit_logs sl JOIN (SELECT submitDate as date FROM submit_logs GROUP BY submitDate) dates ON sl.submitDate=dates.date JOIN deals d ON sl.dealId=d.id WHERE sl.dealStatus=4 AND d.companyId=" +
    companyId +
    " GROUP BY dates.date";
  var query =
    "SELECT DATE_FORMAT(tbl1.date, '%Y-%m-%d') as date, tbl1.numTruckLoaded, tbl2.numTruckUnloaded FROM (" +
    queryTableNumLoaded +
    ") as tbl1 JOIN (" +
    queryTableNumUnloaded +
    ") tbl2 ON tbl1.date=tbl2.date ORDER BY date DESC ";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0)
      res.send({
        status: 200,
        result: results,
      });
  });
});
router.get("/getMonthlyDeliveryTime/:cid", (req, res) => {
  var companyId = req.params.cid;
  var year = new Date().getFullYear();
  var query =
    "SELECT MONTH(startUnloadingAt) as month, AVG(TIMESTAMPDIFF(SECOND, finishLoadingAt, startUnloadingAt)) as avg_delievery_time FROM deals WHERE status>=3 AND companyId=" +
    companyId +
    " AND YEAR(startUnloadingAt)='" +
    year +
    "' GROUP BY MONTH(startUnloadingAt)";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0)
      res.send({
        status: 200,
        result: results,
      });
  });
});
router.get("/getMonthlyNetLoss/:cid", (req, res) => {
  var companyId = req.params.cid;
  var year = new Date().getFullYear();
  var query = "";
  if (companyId == 1)
    query =
      "SELECT MONTH(finishUnloadingAt) as month, AVG(netWeight-newNetWeight) as netLoss FROM deals WHERE status>=3 AND companyId=1 AND status=4 AND YEAR(finishUnloadingAt)='" +
      year +
      "' GROUP BY MONTH(finishUnloadingAt)";
  if (companyId == 2)
    query =
      "SELECT MONTH(finishUnloadingAt) as month, AVG(quantity-newQuantity) as netLoss FROM deals WHERE status>=3 AND companyId=2 AND status=4 AND YEAR(finishUnloadingAt)='" +
      year +
      "' GROUP BY MONTH(finishUnloadingAt)";
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
