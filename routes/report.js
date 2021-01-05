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
    res.send({
      status: 200,
      result: results,
    });
  });
});
router.get("/getAverageDeliveryTime/:cid/:unit", (req, res) => {
  var companyId = req.params.cid;
  var unit = req.params.unit;
  var year = new Date().getFullYear();
  var month = new Date().getMonth() + 1;
  if (unit == "month")
    var query =
      "SELECT MONTH(startUnloadingAt) as month, AVG(TIMESTAMPDIFF(SECOND, finishLoadingAt, startUnloadingAt)) as avg_delievery_time FROM deals WHERE status>=3 AND companyId=" +
      companyId +
      " AND YEAR(startUnloadingAt)='" +
      year +
      "' GROUP BY MONTH(startUnloadingAt)";
  else if (unit == "week")
    var query =
      "SELECT FLOOR((DayOfMonth(startUnloadingAt)-1)/7)+1 as week, AVG(TIMESTAMPDIFF(SECOND, finishLoadingAt, startUnloadingAt)) as avg_delievery_time FROM deals WHERE status>=3 AND companyId=" +
      companyId +
      " AND YEAR(startUnloadingAt)='" +
      year +
      "' AND MONTH(startUnloadingAt)='" +
      month +
      "' GROUP BY FLOOR((DayOfMonth(startUnloadingAt)-1)/7)+1";
  else if (unit == "day")
    var query =
      "SELECT DATE_FORMAT(startUnloadingAt, '%d') as day, AVG(TIMESTAMPDIFF(SECOND, finishLoadingAt, startUnloadingAt)) as avg_delievery_time FROM deals WHERE status>=3 AND companyId=" +
      companyId +
      " AND YEAR(startUnloadingAt)='" +
      year +
      "' AND MONTH(startUnloadingAt)='" +
      month +
      "' GROUP BY DATE_FORMAT(startUnloadingAt, '%d')";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
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
      "SELECT MONTH(finishUnloadingAt) as month, AVG(netWeight-newNetWeight) as netLoss FROM deals WHERE companyId=1 AND status=4 AND YEAR(finishUnloadingAt)='" +
      year +
      "' GROUP BY MONTH(finishUnloadingAt)";
  if (companyId == 2)
    query =
      "SELECT MONTH(finishUnloadingAt) as month, AVG(quantity-newQuantity) as netLoss FROM deals WHERE companyId=2 AND status=4 AND YEAR(finishUnloadingAt)='" +
      year +
      "' GROUP BY MONTH(finishUnloadingAt)";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
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
      "SELECT DATE_FORMAT(d.finishUnloadingAt, '%Y-%m-%d') as date, t.transporter, d.driverName, (d.netWeight-d.newNetWeight) as netLoss, d.finishLoadingAt-d.startLoadingAt as timeLoaded, d.startUnloadingAt-d.finishLoadingAt as timeArrived, d.finishUnloadingAt-d.startUnloadingAt as timeUnloaded FROM deals d LEFT JOIN transporters t ON d.transporterId=t.id WHERE d.status=4 AND d.companyId=1";
  else if (companyId == 2)
    query =
      "SELECT DATE_FORMAT(d.finishUnloadingAt, '%Y-%m-%d') as date, t.transporter, d.driverName, (d.quantity-d.newQuantity) as netLoss, d.finishLoadingAt-d.startLoadingAt as timeLoaded, d.startUnloadingAt-d.finishLoadingAt as timeArrived, d.finishUnloadingAt-d.startUnloadingAt as timeUnloaded FROM deals d LEFT JOIN transporters t ON d.transporterId=t.id WHERE d.status=4 AND d.companyId=2";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send({
      status: 200,
      result: results,
    });
  });
});
router.get("/getSupplierDataHistory/:cid", (req, res) => {
  var companyId = req.params.cid;
  var from = req.query.from;
  var to = req.query.to;
  var query = "";
  if (companyId == 1)
    query =
      "SELECT t.transporter as supplier, SUM(d.netWeight-d.newNetWeight) as netLoss, SUM(TIMESTAMPDIFF(SECOND, d.finishLoadingAt, d.startUnloadingAt))/3600 as deliveryTime, COUNT(*) as numTrips FROM deals d JOIN transporters t ON d.transporterId=t.id WHERE d.status=4" +
      (from ? " AND d.finishUnloadingAt>='" + from + "'" : "") +
      (to ? " AND d.finishUnloadingAt<='" + to + "'" : "") +
      " AND d.companyId=1 GROUP BY t.id";
  if (companyId == 2)
    query =
      "SELECT t.transporter as supplier, SUM(d.quantity-d.newQuantity) as netLoss, SUM(TIMESTAMPDIFF(SECOND, d.finishLoadingAt, d.startUnloadingAt))/3600 as deliveryTime, COUNT(*) as numTrips FROM deals d JOIN transporters t ON d.transporterId=t.id WHERE d.status=4" +
      (from ? " AND d.finishUnloadingAt>='" + from + "'" : "") +
      (to ? " AND d.finishUnloadingAt<='" + to + "'" : "") +
      " AND d.companyId = 2 GROUP BY t.id";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send({
      status: 200,
      result: results,
    });
  });
});
router.get("/getAverageLossPerTrip/:cid/:tid/:unit", (req, res) => {
  var companyId = req.params.cid;
  var transporterId = req.params.tid;
  var unit = req.params.unit;
  var year = new Date().getFullYear();
  var month = new Date().getMonth() + 1;

  var query = "";
  if (unit == "month") {
    if (companyId == 1)
      query =
        "SELECT MONTH(startUnloadingAt) as month, AVG(netWeight-newNetWeight) as avgLoss FROM deals WHERE status=4 AND companyId=" +
        companyId +
        " AND transporterId=" +
        transporterId +
        " AND YEAR(startUnloadingAt)='" +
        year +
        "' GROUP BY MONTH(startUnloadingAt)";
    else
      query =
        "SELECT MONTH(startUnloadingAt) as month, AVG(quantity-newQuantity) as avgLoss FROM deals WHERE status=4 AND companyId=" +
        companyId +
        " AND transporterId=" +
        transporterId +
        " AND YEAR(startUnloadingAt)='" +
        year +
        "' GROUP BY MONTH(startUnloadingAt)";
  } else if (unit == "week") {
    if (companyId == 1)
      query =
        "SELECT FLOOR((DayOfMonth(startUnloadingAt)-1)/7)+1 as week, AVG(netWeight-newNetWeight) as avgLoss FROM deals WHERE status=4 AND companyId=" +
        companyId +
        " AND transporterId=" +
        transporterId +
        " AND YEAR(startUnloadingAt)='" +
        year +
        "' GROUP BY FLOOR((DayOfMonth(startUnloadingAt)-1)/7)+1";
    else
      query =
        "SELECT FLOOR((DayOfMonth(startUnloadingAt)-1)/7)+1 as week, AVG(quantity-newQuantity) as avgLoss FROM deals WHERE status=4 AND companyId=" +
        companyId +
        " AND transporterId=" +
        transporterId +
        " AND YEAR(startUnloadingAt)='" +
        year +
        " AND MONTH(startUnloadingAt)='" +
        month +
        "' GROUP BY FLOOR((DayOfMonth(startUnloadingAt)-1)/7)+1";
  } else if (unit == "day") {
    if (companyId == 1)
      query =
        "SELECT DATE_FORMAT(startUnloadingAt, '%d') as day, AVG(netWeight-newNetWeight) as avgLoss FROM deals WHERE status=4 AND companyId=" +
        companyId +
        " AND transporterId=" +
        transporterId +
        " AND YEAR(startUnloadingAt)=" +
        year +
        " AND MONTH(startUnloadingAt)=" +
        month +
        " GROUP BY DATE_FORMAT(startUnloadingAt, '%d')";
    else
      query =
        "SELECT DATE_FORMAT(startUnloadingAt, '%d') as day, AVG(quantity-newQuantity) as avgLoss FROM deals WHERE status=4 AND companyId=" +
        companyId +
        " AND transporterId=" +
        transporterId +
        " AND YEAR(startUnloadingAt)=" +
        year +
        " AND MONTH(startUnloadingAt)=" +
        month +
        " GROUP BY DATE_FORMAT(startUnloadingAt, '%d')";
  }
  console.log(query);
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send({
      status: 200,
      result: results,
    });
  });
});
module.exports = router;
